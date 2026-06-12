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

## 🤖 Setup Scraper (Firecrawl)

Scraper menggunakan [Firecrawl](https://www.firecrawl.dev) untuk mengambil data harga dari Tokopedia, Shopee, dan TikTok Shop secara otomatis dengan LLM extraction.

### 1. Dapatkan Firecrawl API Key
Daftar/login di https://www.firecrawl.dev/dashboard lalu copy API key kamu.

### 2. Setup Environment Variables Scraper
```bash
cd scraper
cp .env.example .env
```

Isi `.env` dengan nilai yang sesuai:
```env
# Firecrawl
FIRECRAWL_API_KEY=fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Interval scraping dalam jam (default: 6)
SCRAPE_INTERVAL_HOURS=6
```

### 3. Install Dependencies Scraper
```bash
cd scraper
npm install
```

### 4. Jalankan Scraper
```bash
# Jalankan sekali (dev/test)
npm run dev

# Jalankan dengan PM2 (production, auto-restart + cron setiap 6 jam)
npm install -g pm2
pm2 start ecosystem.config.js
pm2 logs hargabandingin-scraper
```

### 5. Tambahkan Produk
Edit `scraper/products.json` untuk menambah/mengubah produk yang di-scrape:
```json
{
  "id": "nama-produk-slug",
  "name": "Nama Produk Lengkap",
  "brand": "Brand",
  "category": "kategori",
  "urls": {
    "tokopedia": "https://www.tokopedia.com/...",
    "shopee": "https://shopee.co.id/...",
    "tiktok": "https://www.tiktok.com/..."
  }
}
```
> URL boleh dikosongkan (`""`) jika produk tidak tersedia di marketplace tersebut.

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
