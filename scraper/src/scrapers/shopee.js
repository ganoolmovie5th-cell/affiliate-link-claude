const FirecrawlApp = require('@mendable/firecrawl-js').default;

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Schema ekstraksi harga Shopee
const EXTRACT_SCHEMA = {
  type: 'object',
  properties: {
    price: {
      type: 'number',
      description: 'Harga jual saat ini dalam Rupiah (angka saja, tanpa Rp atau titik). Contoh: 89000',
    },
    originalPrice: {
      type: 'number',
      description: 'Harga asli sebelum diskon dalam Rupiah (angka saja). Null jika tidak ada diskon.',
    },
    discount: {
      type: 'number',
      description: 'Persentase diskon (angka saja). Contoh: 30 untuk diskon 30%. Null jika tidak ada.',
    },
    rating: {
      type: 'number',
      description: 'Rating produk dari skala 0-5. Contoh: 4.9. Null jika tidak ada.',
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
      description: 'URL gambar utama produk dari CDN Shopee. Null jika tidak ditemukan.',
    },
    productName: {
      type: 'string',
      description: 'Nama lengkap produk sesuai yang tertulis di halaman.',
    },
  },
  required: ['price', 'inStock'],
};


async function scrapeShopee(product) {
  const url = product.urls?.shopee;
  if (!url || url.trim() === '') {
    console.log(`[Shopee] Skip - URL kosong: ${product.name}`);
    return null;
  }

  console.log(`[Shopee] Scraping: ${product.name}`);

  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ['extract'],
      extract: {
        schema: EXTRACT_SCHEMA,
        systemPrompt:
          'Kamu adalah asisten ekstraksi data produk e-commerce Indonesia. ' +
          'Ekstrak informasi harga dari halaman produk Shopee dengan akurat. ' +
          'Harga dalam format Rupiah (Rp), ekstrak sebagai angka bulat saja. ' +
          'Shopee sering menampilkan harga flash sale atau voucher, ambil harga terendah yang tampil.',
      },
      location: { country: 'ID', languages: ['id'] },
      timeout: 60000,
    });

    if (!result?.extract) {
      console.log(`[Shopee] Tidak ada data extract: ${product.name}`);
      return null;
    }

    const data = result.extract;

    if (!data.price || data.price <= 0) {
      console.log(`[Shopee] Gagal parse harga: ${product.name}`);
      return null;
    }

    const output = {
      marketplace: 'shopee',
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
      `[Shopee] ✅ ${product.name}: Rp${output.price.toLocaleString('id-ID')}` +
      `${output.discount ? ` (-${output.discount}%)` : ''}`
    );
    return output;

  } catch (err) {
    console.error(`[Shopee] ❌ Error ${product.name}:`, err.message);
    return null;
  }
}

module.exports = { scrapeShopee };
