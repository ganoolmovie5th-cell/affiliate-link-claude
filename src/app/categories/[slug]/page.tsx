"use client";

import { use } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { CATEGORIES } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: Props) {
  const { slug } = use(params);
  const category = CATEGORIES.find((c) => c.slug === slug);
  const products = MOCK_PRODUCTS.filter((p) => p.category === slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-blue-600">Kategori</Link>
          <span>/</span>
          <span className="text-gray-700">{category?.name || slug}</span>
        </div>
        <div className="flex items-center gap-3">
          {category && <span className="text-4xl">{category.icon}</span>}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{category?.name || slug}</h1>
            <p className="text-gray-500 mt-0.5">{products.length} produk tersedia</p>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <span className="text-5xl mb-4 block">📦</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada produk</h3>
          <p className="text-gray-500 mb-6">Kategori ini belum memiliki produk.</p>
          <Link href="/compare" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
            Lihat Semua Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
