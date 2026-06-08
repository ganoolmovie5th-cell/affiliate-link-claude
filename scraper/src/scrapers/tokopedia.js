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

async function scrapeTokopedia(product) {
  const url = product.urls?.tokopedia;
  if (!url) {
    console.log(`⚠️  Tokopedia URL tidak ada untuk: ${product.name}`);
    return null;
  }

  let browser = null;
  try {
    console.log(`🔍 Scraping Tokopedia: ${product.name}`);

    browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: 'new',
      args: BROWSER_ARGS,
    });

    const page = await browser.newPage();

    // Set user agent supaya tidak terdeteksi bot
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Block resource yang tidak perlu (gambar, font, media) supaya lebih cepat
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'font', 'media', 'stylesheet'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Tunggu elemen harga muncul
    await page.waitForSelector('[data-testid="pdp_comp-price"]', { timeout: 15000 })
      .catch(() => console.log('⚠️  Price selector timeout, trying alternative...'));

    const data = await page.evaluate(() => {
      // Coba berbagai selector harga Tokopedia
      const priceSelectors = [
        '[data-testid="pdp_comp-price"]',
        '.css-o5uqvq',
        '.price',
        'span[class*="price"]',
      ];

      let priceText = null;
      for (const sel of priceSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          priceText = el.innerText;
          break;
        }
      }

      // Original price (coret)
      const originalSelectors = [
        '[data-testid="pdp_comp-price-original"]',
        '.css-1ptfhkb',
        'span[class*="original"]',
      ];
      let originalPriceText = null;
      for (const sel of originalSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          originalPriceText = el.innerText;
          break;
        }
      }

      // Discount badge
      const discountEl = document.querySelector('[data-testid="pdp_comp-price-discount"]') ||
        document.querySelector('span[class*="discount"]');
      const discountText = discountEl ? discountEl.innerText : null;

      // Rating
      const ratingEl = document.querySelector('[data-testid="pdp_comp-rating-number"]') ||
        document.querySelector('span[class*="rating"]');
      const ratingText = ratingEl ? ratingEl.innerText : null;

      // Sold count
      const soldEl = document.querySelector('[data-testid="pdp_comp-sold-count"]') ||
        document.querySelector('span[class*="sold"]');
      const soldText = soldEl ? soldEl.innerText : null;

      // Stock status
      const outOfStockEl = document.querySelector('[data-testid="pdp_comp-empty-stock"]') ||
        document.querySelector('button[disabled]');

      return { priceText, originalPriceText, discountText, ratingText, soldText, outOfStock: !!outOfStockEl };
    });

    // Parse harga: "Rp10.999.000" → 10999000
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
      const cleaned = text.toLowerCase().replace(/[^0-9km]/g, '');
      if (cleaned.includes('k')) return Math.floor(parseFloat(cleaned) * 1000);
      if (cleaned.includes('m')) return Math.floor(parseFloat(cleaned) * 1000000);
      return parseInt(cleaned, 10) || null;
    };

    const price = parsePrice(data.priceText);

    if (!price) {
      console.log(`❌ Gagal parse harga Tokopedia: ${product.name}`);
      return null;
    }

    const result = {
      marketplace: 'tokopedia',
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

    console.log(`✅ Tokopedia ${product.name}: Rp${price.toLocaleString('id-ID')}`);
    return result;

  } catch (err) {
    console.error(`❌ Error scraping Tokopedia ${product.name}:`, err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeTokopedia };
