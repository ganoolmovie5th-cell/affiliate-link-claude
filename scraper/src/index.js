require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const cron = require('node-cron');
const { initFirebase, saveProduct, updateProductPrices, productExists } = require('./firebase');
const { scrapeTokopedia } = require('./scrapers/tokopedia');
const { scrapeShopee } = require('./scrapers/shopee');
const { scrapeTiktok } = require('./scrapers/tiktok');
const products = require('../products.json');

const INTERVAL_HOURS = parseInt(process.env.SCRAPE_INTERVAL_HOURS || '6', 10);
const DELAY_BETWEEN_PRODUCTS_MS = 5000;  // 5 detik antar produk
const DELAY_BETWEEN_SCRAPERS_MS = 3000;  // 3 detik antar marketplace

// Delay helper
const delay = (ms) => new Promise(r => setTimeout(r, ms));

// Format harga untuk log
const formatRp = (price) => price
  ? `Rp${price.toLocaleString('id-ID')}`
  : 'N/A';

// Scrape satu produk dari semua marketplace
async function scrapeProduct(product) {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`📦 Produk: ${product.name}`);
  console.log(`${'─'.repeat(50)}`);

  const results = [];

  // Tokopedia
  const tokopediaData = await scrapeTokopedia(product);
  if (tokopediaData) results.push(tokopediaData);
  await delay(DELAY_BETWEEN_SCRAPERS_MS);

  // Shopee
  const shopeeData = await scrapeShopee(product);
  if (shopeeData) results.push(shopeeData);
  await delay(DELAY_BETWEEN_SCRAPERS_MS);

  // TikTok Shop
  const tiktokData = await scrapeTiktok(product);
  if (tiktokData) results.push(tiktokData);

  if (results.length === 0) {
    console.log(`⚠️  Tidak ada data harga untuk: ${product.name}`);
    return;
  }

  // Log summary
  console.log(`\n📊 Summary ${product.name}:`);
  results.forEach(r => {
    console.log(`  ${r.marketplace.padEnd(10)} → ${formatRp(r.price)} ${r.inStock ? '✅' : '❌ Habis'}`);
  });

  const cheapest = results
    .filter(r => r.inStock)
    .sort((a, b) => a.price - b.price)[0];
  if (cheapest) {
    console.log(`  🏆 Termurah: ${cheapest.marketplace} @ ${formatRp(cheapest.price)}`);
  }

  // Simpan ke Firebase
  const exists = await productExists(product.id);

  if (!exists) {
    // Produk baru → simpan lengkap
    await saveProduct({
      id: product.id,
      name: product.name,
      slug: product.id,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description,
      featured: product.featured || false,
      tags: product.tags || [],
      prices: results,
      createdAt: new Date().toISOString(),
    });
    console.log(`🆕 Produk baru disimpan ke Firebase`);
  } else {
    // Produk sudah ada → update harga saja
    await updateProductPrices(product.id, results);
    console.log(`🔄 Harga diupdate di Firebase`);
  }
}

// Scrape semua produk
async function scrapeAll() {
  const startTime = Date.now();
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`🚀 Mulai scraping: ${new Date().toLocaleString('id-ID')}`);
  console.log(`📋 Total produk: ${products.length}`);
  console.log(`${'═'.repeat(50)}`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`\n[${i + 1}/${products.length}] Processing...`);

    try {
      await scrapeProduct(product);
      success++;
    } catch (err) {
      console.error(`❌ Error pada produk ${product.name}:`, err.message);
      failed++;
    }

    // Delay antar produk (kecuali produk terakhir)
    if (i < products.length - 1) {
      console.log(`⏳ Tunggu ${DELAY_BETWEEN_PRODUCTS_MS / 1000}s sebelum produk berikutnya...`);
      await delay(DELAY_BETWEEN_PRODUCTS_MS);
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`✅ Selesai! Durasi: ${duration} menit`);
  console.log(`   Sukses: ${success} | Gagal: ${failed}`);
  console.log(`   Scraping berikutnya: ${INTERVAL_HOURS} jam lagi`);
  console.log(`${'═'.repeat(50)}\n`);
}

// Main
async function main() {
  console.log('🔥 HargaBandingin Scraper starting...');

  // Init Firebase
  initFirebase();

  // Jalankan langsung saat pertama kali start
  await scrapeAll();

  // Schedule cron job (default: setiap 6 jam)
  const cronExpression = `0 */${INTERVAL_HOURS} * * *`;
  console.log(`⏰ Cron scheduled: setiap ${INTERVAL_HOURS} jam (${cronExpression})`);

  cron.schedule(cronExpression, async () => {
    await scrapeAll();
  });
}

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

main().catch(console.error);
