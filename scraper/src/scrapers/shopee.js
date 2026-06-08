const puppeteer = require('puppeteer-core');

const CHROMIUM_PATH = process.env.CHROMIUM_PATH || '/usr/bin/chromium';

const BROWSER_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--disable-gpu',
  '--disable-extensions',
  '--disable-background-networking',
  '--disable-default-apps',
  '--mute-audio',
  '--hide-scrollbars',
];

async function scrapeShopee(product) {
  const url = product.urls?.shopee;
  if (!url) {
    console.log(`⚠️  Shopee URL tidak ada untuk: ${product.name}`);
    return null;
  }

  let browser = null;
  try {
    console.log(`🔍 Scraping Shopee: ${product.name}`);

    browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: 'new',
      args: BROWSER_ARGS,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Block resource tidak perlu
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

    // Shopee butuh waktu extra untuk render
    await new Promise(r => setTimeout(r, 3000));

    // Tunggu harga muncul
    await page.waitForSelector('._3n5NQx, [class*="priceSale"], [class*="price"]', { timeout: 15000 })
      .catch(() => {});

    const data = await page.evaluate(() => {
      // Selector harga Shopee (bisa berubah)
      const priceSelectors = [
        '._3n5NQx',
        '[class*="priceSale"]',
        '[class*="price--current"]',
        '.product-price__current',
        'span[class*="price"]',
      ];

      let priceText = null;
      for (const sel of priceSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.includes('Rp')) {
          priceText = el.innerText;
          break;
        }
      }

      // Original price
      const originalSelectors = [
        '[class*="priceOriginal"]',
        '[class*="price--before"]',
        '.product-price__original',
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
      const discountEl = document.querySelector('[class*="discount"]') ||
        document.querySelector('[class*="promo"]');
      const discountText = discountEl ? discountEl.innerText : null;

      // Rating
      const ratingEl = document.querySelector('[class*="rating"] span') ||
        document.querySelector('.product-rating__score');
      const ratingText = ratingEl ? ratingEl.innerText : null;

      // Sold
      const soldEl = document.querySelector('[class*="sold"]');
      const soldText = soldEl ? soldEl.innerText : null;

      // Stock
      const outOfStockEl = document.querySelector('[class*="out-of-stock"]') ||
        document.querySelector('button[disabled][class*="buy"]');

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
      console.log(`❌ Gagal parse harga Shopee: ${product.name}`);
      return null;
    }

    const result = {
      marketplace: 'shopee',
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

    console.log(`✅ Shopee ${product.name}: Rp${price.toLocaleString('id-ID')}`);
    return result;

  } catch (err) {
    console.error(`❌ Error scraping Shopee ${product.name}:`, err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeShopee };
