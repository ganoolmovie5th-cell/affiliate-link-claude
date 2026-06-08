const axios = require('axios');
const cheerio = require('cheerio');

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

async function scrapeTokopedia(product) {
  const url = product.urls?.tokopedia;
  if (!url) {
    console.log(`⚠️  Tokopedia URL tidak ada untuk: ${product.name}`);
    return null;
  }

  try {
    console.log(`🔍 Scraping Tokopedia: ${product.name}`);

    // Pakai ScraperAPI dengan render=true supaya JS dijalankan
    const apiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}&country_code=id`;

    const response = await axios.get(apiUrl, { timeout: 70000 });
    const $ = cheerio.load(response.data);

    // Parse harga dari HTML
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

    // Coba berbagai selector harga Tokopedia
    let priceText = null;
    const priceSelectors = [
      '[data-testid="pdp_comp-price"]',
      '[class*="price"]',
      'span[class*="Price"]',
    ];
    for (const sel of priceSelectors) {
      const el = $(sel).first();
      if (el.length && el.text().includes('Rp')) {
        priceText = el.text().trim();
        break;
      }
    }

    // Cari semua teks yang mengandung Rp jika selector tidak cocok
    if (!priceText) {
      $('span, div, p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.match(/^Rp[\d.,]+$/) || text.match(/^Rp\s[\d.,]+$/)) {
          priceText = text;
          return false; // break
        }
      });
    }

    const originalPriceText = $('[data-testid="pdp_comp-price-original"], [class*="original"]').first().text().trim() || null;
    const discountText = $('[data-testid="pdp_comp-price-discount"], [class*="discount"]').first().text().trim() || null;
    const ratingText = $('[data-testid="pdp_comp-rating-number"], [class*="rating"]').first().text().trim() || null;
    const soldText = $('[data-testid="pdp_comp-sold-count"], [class*="sold"]').first().text().trim() || null;
    const outOfStock = $('[data-testid="pdp_comp-empty-stock"]').length > 0;

    // Scrape imageUrl dari produk
    // Prioritas: images.tokopedia.net (tidak expire) > og:image (ada expiry)
    let imageUrl = null;

    // Cari img dari domain images.tokopedia.net (URL permanen)
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      if (src.includes('images.tokopedia.net') && src.includes('.jpeg')) {
        // Ambil versi 700px
        imageUrl = src.replace(/cache\/\d+\//, 'cache/700/').split('~')[0] + '~.jpeg';
        return false; // break
      }
    });

    // Fallback: og:image (meski ada expiry, masih bisa dipakai sementara)
    if (!imageUrl) {
      const ogImage = $('meta[property="og:image"]').attr('content');
      if (ogImage && ogImage.startsWith('http')) {
        imageUrl = ogImage;
      }
    }

    const price = parsePrice(priceText);

    if (!price) {
      console.log(`❌ Gagal parse harga Tokopedia: ${product.name}`);
      console.log(`   HTML snippet: ${response.data.substring(0, 300)}`);
      return null;
    }

    const result = {
      marketplace: 'tokopedia',
      price,
      originalPrice: parsePrice(originalPriceText) || undefined,
      discount: parseDiscount(discountText) || undefined,
      affiliateUrl: url,
      productUrl: url,
      inStock: !outOfStock,
      rating: ratingText ? parseFloat(ratingText) : undefined,
      sold: parseSold(soldText) || undefined,
      lastUpdated: new Date().toISOString(),
      imageUrl: imageUrl || undefined,
    };

    console.log(`✅ Tokopedia ${product.name}: Rp${price.toLocaleString('id-ID')}${imageUrl ? ' 🖼️' : ''}`);
    return result;

  } catch (err) {
    console.error(`❌ Error scraping Tokopedia ${product.name}:`, err.message);
    return null;
  }
}

module.exports = { scrapeTokopedia };
