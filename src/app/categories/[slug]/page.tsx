"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/products";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { CATEGORIES } from "@/types";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: Props) {
  const { slug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const category = CATEGORIES.find((c) => c.slug === slug);

  useEffect(() => {
    getProducts(slug).then((data) => {
      setProducts(data.length > 0 ? data : MOCK_PRODUCTS.filter(p => p.category === slug));
      setLoading(false);
    }).catch(() => {
      setProducts(MOCK_PRODUCTS.filter(p => p.category === slug));
      setLoading(false);
    });
  }, [slug]);

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
            <p className="text-gray-500 mt-0.5">
              {loading ? "Memuat..." : `${products.length} produk tersedia`}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mt-3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
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
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
