const axios = require('axios');
const cheerio = require('cheerio');

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

async function scrapeTiktok(product) {
  const url = product.urls?.tiktok;
  if (!url || url.trim() === '') {
    console.log(`[TikTok] Skip - URL kosong: ${product.name}`);
    return null;
  }

  try {
    console.log(`[TikTok] Scraping: ${product.name}`);

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
      console.log(`[TikTok] Gagal parse harga: ${product.name}`);
      return null;
    }

    console.log(`[TikTok] OK ${product.name}: Rp${price.toLocaleString('id-ID')}`);
    return {
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
  } catch (err) {
    console.error(`[TikTok] Error ${product.name}:`, err.message);
    return null;
  }
}

module.exports = { scrapeTiktok };
