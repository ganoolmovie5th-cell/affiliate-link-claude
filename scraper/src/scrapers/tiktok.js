const FirecrawlApp = require('@mendable/firecrawl-js').default;

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Schema ekstraksi harga TikTok Shop
const EXTRACT_SCHEMA = {
  type: 'object',
  properties: {
    price: {
      type: 'number',
      description: 'Harga jual saat ini dalam Rupiah (angka saja, tanpa Rp atau titik). Contoh: 125000',
    },
    originalPrice: {
      type: 'number',
      description: 'Harga asli sebelum diskon dalam Rupiah (angka saja). Null jika tidak ada diskon.',
    },
    discount: {
      type: 'number',
      description: 'Persentase diskon (angka saja). Contoh: 15 untuk diskon 15%. Null jika tidak ada.',
    },
    rating: {
      type: 'number',
      description: 'Rating produk dari skala 0-5. Contoh: 4.7. Null jika tidak ada.',
    },
    sold: {
      type: 'number',
      description: 'Total produk terjual (angka saja). Null jika tidak ada.',
    },
    inStock: {
      type: 'boolean',
      description: 'true jika produk masih tersedia/ada stok, false jika habis/kosong.',
    },
    imageUrl: {
      type: 'string',
      description: 'URL gambar utama produk dari CDN TikTok Shop. Null jika tidak ditemukan.',
    },
    productName: {
      type: 'string',
      description: 'Nama lengkap produk sesuai yang tertulis di halaman.',
    },
  },
  required: ['price', 'inStock'],
};


async function scrapeTiktok(product) {
  const url = product.urls?.tiktok;
  if (!url || url.trim() === '') {
    console.log(`[TikTok] Skip - URL kosong: ${product.name}`);
    return null;
  }

  console.log(`[TikTok] Scraping: ${product.name}`);

  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ['extract'],
      extract: {
        schema: EXTRACT_SCHEMA,
        systemPrompt:
          'Kamu adalah asisten ekstraksi data produk e-commerce Indonesia. ' +
          'Ekstrak informasi harga dari halaman produk TikTok Shop dengan akurat. ' +
          'Harga dalam format Rupiah (Rp), ekstrak sebagai angka bulat saja. ' +
          'TikTok Shop sering ada harga coret (original) dan harga promo, ambil harga promo sebagai price.',
      },
      location: { country: 'ID', languages: ['id'] },
      timeout: 60000,
    });

    if (!result?.extract) {
      console.log(`[TikTok] Tidak ada data extract: ${product.name}`);
      return null;
    }

    const data = result.extract;

    if (!data.price || data.price <= 0) {
      console.log(`[TikTok] Gagal parse harga: ${product.name}`);
      return null;
    }

    const output = {
      marketplace: 'tiktok',
      price: Math.round(data.price),
      originalPrice: data.originalPrice ? Math.round(data.originalPrice) : undefined,
      discount: data.discount ?? undefined,
      affiliateUrl: url,
      productUrl: url,
      inStock: data.inStock ?? true,
      rating: data.rating ?? undefined,
      sold: data.sold ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
      lastUpdated: new Date().toISOString(),
    };

    console.log(
      `[TikTok] ✅ ${product.name}: Rp${output.price.toLocaleString('id-ID')}` +
      `${output.discount ? ` (-${output.discount}%)` : ''}`
    );
    return output;

  } catch (err) {
    console.error(`[TikTok] ❌ Error ${product.name}:`, err.message);
    return null;
  }
}

module.exports = { scrapeTiktok };
