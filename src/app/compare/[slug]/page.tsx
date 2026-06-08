"use client";

import { use } from "react";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { getCheapestPrice, formatPrice } from "@/lib/products";
import PriceComparisonTable from "@/components/product/PriceComparisonTable";
import ProductCard from "@/components/product/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl mb-4 block">😕</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Produk tidak ditemukan</h1>
        <p className="text-gray-500 mb-6">Produk yang kamu cari tidak ada atau sudah dihapus.</p>
        <Link href="/compare" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Kembali ke Daftar Produk
        </Link>
      </div>
    );
  }

  const cheapest = getCheapestPrice(product);
  const related = MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const savings = cheapest?.originalPrice ? cheapest.originalPrice - cheapest.price : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-blue-600">Bandingkan</Link>
        <span>/</span>
        <span className="text-gray-700 line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product image */}
        <div className="relative aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/600x600/f3f4f6/9ca3af?text=${encodeURIComponent(product.brand)}`;
            }}
          />
          {product.featured && (
            <span className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
                {product.brand}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full capitalize">
                {product.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-gray-500 mt-3 leading-relaxed">{product.description}</p>
          </div>

          {/* Best price highlight */}
          {cheapest && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-sm font-medium text-blue-700 mb-1">🏆 Harga Terbaik Sekarang</p>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-extrabold text-gray-900">
                  {formatPrice(cheapest.price)}
                </span>
                {cheapest.originalPrice && cheapest.originalPrice > cheapest.price && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(cheapest.originalPrice)}
                  </span>
                )}
                {cheapest.discount && (
                  <span className="text-sm font-bold text-white bg-red-500 px-2 py-0.5 rounded-lg">
                    -{cheapest.discount}%
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-sm text-green-600 font-semibold mb-3">
                  ✅ Hemat {formatPrice(savings)} dari harga normal
                </p>
              )}
              <a
                href={cheapest.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg active:scale-95 w-full justify-center"
              >
                Beli di {cheapest.marketplace === "shopee" ? "Shopee" : cheapest.marketplace === "tokopedia" ? "Tokopedia" : "TikTok Shop"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium">Tags:</p>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{product.prices.filter(p => p.inStock).length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Marketplace</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-900">
                {cheapest?.discount ? `${cheapest.discount}%` : "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Max Diskon</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-900">
                {Math.max(...product.prices.filter(p => p.rating).map(p => p.rating ?? 0)).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Rating Max</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price comparison table */}
      <PriceComparisonTable product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Produk Serupa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
