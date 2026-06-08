require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const admin = require('firebase-admin');

let db = null;

function initFirebase() {
  if (admin.apps.length > 0) return admin.apps[0];

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null;

  if (!privateKey || !process.env.FIREBASE_PROJECT_ID) {
    throw new Error('Firebase credentials tidak ditemukan di .env');
  }

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });

  db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });

  console.log(`✅ Firebase connected: ${process.env.FIREBASE_PROJECT_ID}`);
  return app;
}

function getDb() {
  if (!db) {
    initFirebase();
  }
  return db;
}

// Simpan/update satu produk ke Firestore
async function saveProduct(productData) {
  const db = getDb();
  const ref = db.collection('products').doc(productData.id);

  await ref.set({
    ...productData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`💾 Saved: ${productData.name}`);
}

// Update hanya harga (prices array) dari produk yang sudah ada
async function updateProductPrices(productId, prices, imageUrl = null) {
  const db = getDb();
  const ref = db.collection('products').doc(productId);

  const updateData = {
    prices,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Update imageUrl kalau ada hasil scraping baru
  if (imageUrl) {
    updateData.imageUrl = imageUrl;
  }

  await ref.update(updateData);
  console.log(`💰 Prices updated: ${productId}`);
}

// Cek apakah produk sudah ada di Firestore
async function productExists(productId) {
  const db = getDb();
  const ref = db.collection('products').doc(productId);
  const doc = await ref.get();
  return doc.exists;
}

module.exports = { initFirebase, getDb, saveProduct, updateProductPrices, productExists };
