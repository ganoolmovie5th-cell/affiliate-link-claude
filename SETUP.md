# HargaBandingin - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.local.example` dan isi dengan config Firebase kamu:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_ADMIN_PASSWORD=passwordkamu
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 🔥 Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Buat project baru
3. Aktifkan **Firestore Database**
4. Buat collection `products` dengan structure:
   ```
   products/
   ├── {id}/
   │   ├── name: string
   │   ├── slug: string
   │   ├── brand: string
   │   ├── category: string
   │   ├── imageUrl: string
   │   ├── description: string
   │   ├── featured: boolean
   │   ├── tags: string[]
   │   ├── createdAt: timestamp
   │   ├── updatedAt: timestamp
   │   └── prices: [
   │       ├── marketplace: "shopee" | "tokopedia" | "tiktok"
   │       ├── price: number
   │       ├── originalPrice: number
   │       ├── discount: number
   │       ├── affiliateUrl: string
   │       ├── productUrl: string
   │       ├── inStock: boolean
   │       ├── rating: number
   │       ├── sold: number
   │       └── lastUpdated: string
   │       ]
   ```
5. Set Firestore Rules (untuk production):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /products/{document=**} {
         allow read: if true;
         allow write: if false; // Ganti dengan auth check untuk admin
       }
     }
   }
   ```

---

## 💰 Affiliate Program Registration

| Marketplace | Link Daftar |
|------------|-------------|
| **Shopee Affiliate** | https://affiliate.shopee.co.id |
| **Tokopedia Affiliate** | https://affiliate.tokopedia.com |
| **TikTok Shop Affiliate** | https://affiliate.tiktok.com |

---

## 🌐 Deploy ke Vercel

1. Push ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import project
3. Tambahkan environment variables dari `.env.local`
4. Deploy!

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── compare/
│   │   ├── page.tsx          # Daftar semua produk
│   │   └── [slug]/page.tsx   # Detail & comparison
│   ├── search/page.tsx       # Halaman pencarian
│   ├── categories/
│   │   ├── page.tsx          # Semua kategori
│   │   └── [slug]/page.tsx   # Produk per kategori
│   └── admin/page.tsx        # Admin dashboard
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── ui/                   # Badge, PriceTag, StarRating
│   ├── product/              # ProductCard, PriceComparisonTable
│   └── admin/                # Login, Dashboard, Form
├── lib/
│   ├── firebase.ts           # Firebase config
│   ├── products.ts           # CRUD operations
│   ├── mockData.ts           # Data dummy (ganti dengan Firebase)
│   └── utils.ts              # Helper functions
└── types/
    └── index.ts              # TypeScript types
```
