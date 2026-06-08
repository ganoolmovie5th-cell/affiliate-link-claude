"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/products";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import type { Product } from "@/types";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      const products = data.length > 0 ? data : MOCK_PRODUCTS;
      setAllProducts(products);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(allProducts);
      return;
    }
    const lower = query.toLowerCase();
    setResults(allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.brand.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.tags?.some((t) => t.toLowerCase().includes(lower))
    ));
  }, [query, allProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-gray-700">Pencarian</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {query ? (
            <>Hasil pencarian untuk &quot;<span className="text-blue-600">{query}</span>&quot;</>
          ) : "Semua Produk"}
        </h1>
        <p className="text-gray-500 mt-1">
          {loading ? "Mencari produk..." : `${results.length} produk ditemukan`}
        </p>
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
      ) : results.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Produk tidak ditemukan</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Coba gunakan kata kunci lain atau cek ejaan yang kamu masukkan.
          </p>
          <Link href="/compare" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Lihat Semua Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-gray-500">Mencari produk...</div>}>
      <SearchResults />
    </Suspense>
  );
}
