const axios = require('axios');
const cheerio = require('cheerio');

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

async function scrapeTiktok(product) {
  const url = product.urls?.tiktok;
  if (!url) {
    console.log(`⚠️  TikTok URL tidak ada untuk: ${product.name}`);
    return null;
  }

  try {
    console.log(`🔍 Scraping TikTok Shop: ${product.name}`);

    const apiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}&render=true&country_code=id`;

    const response = await axios.get(apiUrl, { timeout: 70000 });
    const $ = cheerio.load(response.data);

    const parsePrice = (text) => {
      if (!text) return null;
      const cleaned = text.replace(/[^0-9]/g, '');
      return cleaned ? parseInt(cleaned, 10) : null;
    };

    const parseDiscount = (text) => {
      if (!text) return null;
      const match = text.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : null;
    };

    const parseSold = (text) => {
      if (!text) return null;
      const lower = text.toLowerCase();
      const numMatch = lower.match(/[\d.]+/);
      if (!numMatch) return null;
      const num = parseFloat(numMatch[0]);
      if (lower.includes('rb') || lower.includes('k')) return Math.floor(num * 1000);
      if (lower.includes('jt') || lower.includes('m')) return Math.floor(num * 1000000);
      return Math.floor(num);
    };

    // Cari harga TikTok Shop
    let priceText = null;
    const priceSelectors = [
      '[class*="sale-price"]',
      '[class*="SalePrice"]',
      '[class*="current-price"]',
      '[data-e2e="product-price"]',
      '[class*="price"]',
    ];
    for (const sel of priceSelectors) {
      const el = $(sel).first();
      if (el.length && el.text().includes('Rp')) {
        priceText = el.text().trim();
        break;
      }
    }

    // Fallback
    if (!priceText) {
      $('span, div').each((_, el) => {
        const text = $(el).text().trim();
        if (text.match(/^Rp[\d.,]+$/) || text.match(/^Rp\s[\d.,]+$/)) {
          priceText = text;
          return false;
        }
      });
    }

    const originalPriceText = $('[class*="original-price"], [class*="OriginalPrice"]').first().text().trim() || null;
    const discountText = $('[class*="discount-tag"], [class*="DiscountTag"]').first().text().trim() || null;
    const ratingText = $('[class*="rating-score"], [data-e2e="product-rating"]').first().text().trim() || null;
    const soldText = $('[class*="sold-count"], [data-e2e="product-sold"]').first().text().trim() || null;
    const outOfStock = $('[class*="out-of-stock"]').length > 0;

    const price = parsePrice(priceText);

    if (!price) {
      console.log(`❌ Gagal parse harga TikTok: ${product.name}`);
      console.log(`   HTML snippet: ${response.data.substring(0, 300)}`);
      return null;
    }

    const result = {
      marketplace: 'tiktok',
      price,
      originalPrice: parsePrice(originalPriceText) || undefined,
      discount: parseDiscount(discountText) || undefined,
      affiliateUrl: url,
      productUrl: url,
      inStock: !outOfStock,
      rating: ratingText ? parseFloat(ratingText) : undefined,
      sold: parseSold(soldText) || undefined,
      lastUpdated: new Date().toISOString(),
    };

    console.log(`✅ TikTok ${product.name}: Rp${price.toLocaleString('id-ID')}`);
    return result;

  } catch (err) {
    console.error(`❌ Error scraping TikTok ${product.name}:`, err.message);
    return null;
  }
}

module.exports = { scrapeTiktok };
  const url = product.urls?.tiktok;
  if (!url) {
    console.log(`⚠️  TikTok URL tidak ada untuk: ${product.name}`);
    return null;
  }

  let browser = null;
  try {
    console.log(`🔍 Scraping TikTok Shop: ${product.name}`);

    browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: 'new',
      args: BROWSER_ARGS,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.setViewport({ width: 1280, height: 800 });

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'font', 'media'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });

    // TikTok Shop butuh waktu extra
    await new Promise(r => setTimeout(r, 4000));

    await page.waitForSelector('[class*="price"], [class*="Price"]', { timeout: 15000 })
      .catch(() => {});

    const data = await page.evaluate(() => {
      // Selector harga TikTok Shop
      const priceSelectors = [
        '[class*="sale-price"]',
        '[class*="SalePrice"]',
        '[class*="current-price"]',
        '[class*="CurrentPrice"]',
        '[data-e2e="product-price"]',
        'span[class*="price"]',
      ];

      let priceText = null;
      for (const sel of priceSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText) {
          priceText = el.innerText;
          break;
        }
      }

      // Original price
      const originalSelectors = [
        '[class*="original-price"]',
        '[class*="OriginalPrice"]',
        '[class*="before-price"]',
      ];
      let originalPriceText = null;
      for (const sel of originalSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          originalPriceText = el.innerText;
          break;
        }
      }

      // Discount
      const discountEl = document.querySelector('[class*="discount-tag"]') ||
        document.querySelector('[class*="DiscountTag"]');
      const discountText = discountEl ? discountEl.innerText : null;

      // Rating
      const ratingEl = document.querySelector('[class*="rating-score"]') ||
        document.querySelector('[data-e2e="product-rating"]');
      const ratingText = ratingEl ? ratingEl.innerText : null;

      // Sold
      const soldEl = document.querySelector('[class*="sold-count"]') ||
        document.querySelector('[data-e2e="product-sold"]');
      const soldText = soldEl ? soldEl.innerText : null;

      // Stock
      const outOfStockEl = document.querySelector('[class*="out-of-stock"]') ||
        document.querySelector('button[disabled][class*="cart"]');

      return { priceText, originalPriceText, discountText, ratingText, soldText, outOfStock: !!outOfStockEl };
    });

    const parsePrice = (text) => {
      if (!text) return null;
      const cleaned = text.replace(/[^0-9]/g, '');
      return cleaned ? parseInt(cleaned, 10) : null;
    };

    const parseDiscount = (text) => {
      if (!text) return null;
      const match = text.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : null;
    };

    const parseSold = (text) => {
      if (!text) return null;
      const lower = text.toLowerCase();
      const numMatch = lower.match(/[\d.]+/);
      if (!numMatch) return null;
      const num = parseFloat(numMatch[0]);
      if (lower.includes('rb') || lower.includes('k')) return Math.floor(num * 1000);
      if (lower.includes('jt') || lower.includes('m')) return Math.floor(num * 1000000);
      return Math.floor(num);
    };

    const price = parsePrice(data.priceText);

    if (!price) {
      console.log(`❌ Gagal parse harga TikTok: ${product.name}`);
      return null;
    }

    const result = {
      marketplace: 'tiktok',
      price,
      originalPrice: parsePrice(data.originalPriceText) || undefined,
      discount: parseDiscount(data.discountText) || undefined,
      affiliateUrl: url,
      productUrl: url,
      inStock: !data.outOfStock,
      rating: data.ratingText ? parseFloat(data.ratingText) : undefined,
      sold: parseSold(data.soldText) || undefined,
      lastUpdated: new Date().toISOString(),
    };

    console.log(`✅ TikTok ${product.name}: Rp${price.toLocaleString('id-ID')}`);
    return result;

  } catch (err) {
    console.error(`❌ Error scraping TikTok ${product.name}:`, err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeTiktok };
