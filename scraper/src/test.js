require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { initFirebase, saveProduct } = require('./firebase');

async function testFirebase() {
  console.log('🧪 Testing Firebase connection...');
  try {
    initFirebase();
    await saveProduct({
      id: 'test-product',
      name: 'Test Product',
      slug: 'test-product',
      brand: 'Test',
      category: 'test',
      imageUrl: 'https://via.placeholder.com/400',
      description: 'Test product untuk verify Firebase connection',
      featured: false,
      tags: ['test'],
      prices: [
        {
          marketplace: 'tokopedia',
          price: 100000,
          inStock: true,
          affiliateUrl: 'https://tokopedia.com',
          productUrl: 'https://tokopedia.com',
          lastUpdated: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
    });
    console.log('✅ Firebase OK! Test product berhasil disimpan.');
    console.log('📌 Cek di Firebase Console → Firestore → products → test-product');
    process.exit(0);
  } catch (err) {
    console.error('❌ Firebase Error:', err.message);
    process.exit(1);
  }
}

testFirebase();
