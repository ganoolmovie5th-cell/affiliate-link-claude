"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { CATEGORIES } from "@/types";

export default function ComparePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  const filtered = MOCK_PRODUCTS.filter((p) =>
    selectedCategory === "all" ? true : p.category === selectedCategory
  ).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price-asc") {
      const aMin = Math.min(...a.prices.filter(p => p.inStock).map(p => p.price));
      const bMin = Math.min(...b.prices.filter(p => p.inStock).map(p => p.price));
      return aMin - bMin;
    }
    if (sortBy === "price-desc") {
      const aMin = Math.min(...a.prices.filter(p => p.inStock).map(p => p.price));
      const bMin = Math.min(...b.prices.filter(p => p.inStock).map(p => p.price));
      return bMin - aMin;
    }
    // featured default
    return b.featured ? 1 : -1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-gray-700">Bandingkan Harga</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bandingkan Harga Semua Produk</h1>
        <p className="text-gray-500 mt-1">
          {filtered.length} produk dari official store Shopee, Tokopedia & TikTok Shop
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filter */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sticky top-20">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Kategori</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === "all"
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Semua Kategori
                </button>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      selectedCategory === cat.slug
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-semibold text-gray-900">{filtered.length}</span> produk
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Urutkan:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="featured">Terpopuler</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="name">Nama A-Z</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">📦</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada produk</h3>
              <p className="text-gray-500 text-sm">Kategori ini belum memiliki produk. Tambahkan lewat admin panel.</p>
              <Link href="/admin" className="mt-4 inline-block btn-primary text-sm px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">
                Ke Admin Panel
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
