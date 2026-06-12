const FirecrawlApp = require('@mendable/firecrawl-js').default;

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Schema ekstraksi harga Tokopedia
const EXTRACT_SCHEMA = {
  type: 'object',
  properties: {
    price: {
      type: 'number',
      description: 'Harga jual saat ini dalam Rupiah (angka saja, tanpa Rp atau titik). Contoh: 15990000',
    },
    originalPrice: {
      type: 'number',
      description: 'Harga asli sebelum diskon dalam Rupiah (angka saja). Null jika tidak ada diskon.',
    },
    discount: {
      type: 'number',
      description: 'Persentase diskon (angka saja). Contoh: 20 untuk diskon 20%. Null jika tidak ada.',
    },
    rating: {
      type: 'number',
      description: 'Rating produk dari skala 0-5. Contoh: 4.8. Null jika tidak ada.',
    },
    sold: {
      type: 'number',
      description: 'Total produk terjual (angka saja). Contoh: 1500. Null jika tidak ada.',
    },
    inStock: {
      type: 'boolean',
      description: 'true jika produk masih tersedia/ada stok, false jika habis/kosong.',
    },
    imageUrl: {
      type: 'string',
      description: 'URL gambar utama produk dari domain images.tokopedia.net. Null jika tidak ditemukan.',
    },
    productName: {
      type: 'string',
      description: 'Nama lengkap produk sesuai yang tertulis di halaman.',
    },
  },
  required: ['price', 'inStock'],
};

async function scrapeTokopedia(product) {
  const url = product.urls?.tokopedia;
  if (!url || url.trim() === '') {
    console.log(`[Tokopedia] Skip - URL kosong: ${product.name}`);
    return null;
  }

  console.log(`[Tokopedia] Scraping: ${product.name}`);

  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ['extract'],
      extract: {
        schema: EXTRACT_SCHEMA,
        systemPrompt:
          'Kamu adalah asisten ekstraksi data produk e-commerce Indonesia. ' +
          'Ekstrak informasi harga dari halaman produk Tokopedia dengan akurat. ' +
          'Harga dalam format Rupiah (Rp), ekstrak sebagai angka bulat saja.',
      },
      location: { country: 'ID', languages: ['id'] },
      timeout: 60000,
    });

    if (!result?.extract) {
      console.log(`[Tokopedia] Tidak ada data extract: ${product.name}`);
      return null;
    }

    const data = result.extract;

    if (!data.price || data.price <= 0) {
      console.log(`[Tokopedia] Gagal parse harga: ${product.name}`);
      return null;
    }

    const output = {
      marketplace: 'tokopedia',
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
      `[Tokopedia] ✅ ${product.name}: Rp${output.price.toLocaleString('id-ID')}` +
      `${output.discount ? ` (-${output.discount}%)` : ''}` +
      `${output.imageUrl ? ' 🖼️' : ''}`
    );
    return output;

  } catch (err) {
    console.error(`[Tokopedia] ❌ Error ${product.name}:`, err.message);
    return null;
  }
}

module.exports = { scrapeTokopedia };
