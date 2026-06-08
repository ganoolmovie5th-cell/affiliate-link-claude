"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/products";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { CATEGORIES } from "@/types";
import type { Product } from "@/types";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS.filter(p => p.featured));
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getProducts().then((data) => {
      if (data.length > 0) {
        setProducts(data.filter(p => p.featured).slice(0, 8));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Harga diupdate setiap 12 jam
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Bandingkan Harga{" "}
              <span className="text-yellow-300">Official Store</span>
              <br />di 3 Marketplace
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto">
              Shopee, Tokopedia, dan TikTok Shop dalam satu halaman. Klik langsung ke harga termurah!
            </p>
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-8">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk, brand, atau kategori..."
                className="w-full pl-5 pr-36 py-4 rounded-2xl text-gray-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Cari Harga
              </button>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-blue-200">Populer:</span>
              {["Samsung", "Xiaomi", "Wardah", "Realme", "Somethinc"].map((term) => (
                <button
                  key={term}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
                  className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="h-10 bg-gray-50" style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}></div>
      </section>

      {/* Marketplace strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🛒</span>
              <div>
                <p className="font-bold text-orange-600 text-sm">Shopee</p>
                <p className="text-xs text-gray-400">Official Store</p>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏪</span>
              <div>
                <p className="font-bold text-green-600 text-sm">Tokopedia</p>
                <p className="text-xs text-gray-400">Official Store</p>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎵</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">TikTok Shop</p>
                <p className="text-xs text-gray-400">Official Store</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Telusuri Kategori</h2>
          <Link href="/categories" className="text-sm text-blue-600 hover:underline font-medium">
            Lihat semua →
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all text-center group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-700 leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Produk Terpopuler</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? "Memuat data..." : `${products.length} produk tersedia`}
            </p>
          </div>
          <Link href="/compare" className="text-sm text-blue-600 hover:underline font-medium">
            Lihat semua →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mt-3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Cara Kerja HargaBandingin</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "🔍", title: "Cari Produk", desc: "Ketik nama produk atau brand yang kamu inginkan di kolom pencarian." },
              { step: "02", icon: "📊", title: "Bandingkan Harga", desc: "Lihat harga dari Shopee, Tokopedia, dan TikTok Shop side-by-side." },
              { step: "03", icon: "🏆", title: "Beli Termurah", desc: "Klik tombol beli ke marketplace dengan harga terbaik via link affiliate." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl text-3xl mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-blue-600 mb-1">LANGKAH {item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
