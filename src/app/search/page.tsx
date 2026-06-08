"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mockData";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState(MOCK_PRODUCTS);

  useEffect(() => {
    if (!query.trim()) {
      setResults(MOCK_PRODUCTS);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.brand.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.tags?.some((t) => t.toLowerCase().includes(lower))
    );
    setResults(filtered);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-gray-700">Pencarian</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {query ? (
            <>Hasil pencarian untuk &quot;<span className="text-blue-600">{query}</span>&quot;</>
          ) : (
            "Semua Produk"
          )}
        </h1>
        <p className="text-gray-500 mt-1">
          {results.length > 0
            ? `${results.length} produk ditemukan`
            : "Tidak ada produk yang cocok"}
        </p>
      </div>

      {results.length === 0 ? (
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
