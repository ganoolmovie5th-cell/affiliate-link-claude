"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, getCheapestPrice, formatPrice } from "@/lib/products";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import PriceComparisonTable from "@/components/product/PriceComparisonTable";
import ProductCard from "@/components/product/ProductCard";
import ProductImage from "@/components/ui/ProductImage";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      const all = data.length > 0 ? data : MOCK_PRODUCTS;
      const found = all.find((p) => p.slug === slug || p.id === slug) || null;
      setProduct(found);
      if (found) {
        setRelated(all.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 4));
      }
      setLoading(false);
    }).catch(() => {
      const found = MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
      setProduct(found);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

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
  const savings = cheapest?.originalPrice ? cheapest.originalPrice - cheapest.price : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-blue-600">Bandingkan</Link>
        <span>/</span>
        <span className="text-gray-700 line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="relative aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            fallbackText={product.brand}
            className="w-full h-full object-cover"
          />
          {product.featured && (
            <span className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <p className="text-gray-500 mt-3 leading-relaxed">{product.description}</p>
          </div>

          {cheapest && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-sm font-medium text-blue-700 mb-1">🏆 Harga Terbaik Sekarang</p>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-extrabold text-gray-900">{formatPrice(cheapest.price)}</span>
                {cheapest.originalPrice && cheapest.originalPrice > cheapest.price && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(cheapest.originalPrice)}</span>
                )}
                {cheapest.discount && (
                  <span className="text-sm font-bold text-white bg-red-500 px-2 py-0.5 rounded-lg">-{cheapest.discount}%</span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-sm text-green-600 font-semibold mb-3">Hemat {formatPrice(savings)} dari harga normal</p>
              )}
              <a
                href={cheapest.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg w-full justify-center"
              >
                Beli di {cheapest.marketplace === "shopee" ? "Shopee" : cheapest.marketplace === "tokopedia" ? "Tokopedia" : "TikTok Shop"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {product.tags?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium">Tags:</p>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{product.prices?.filter(p => p.inStock).length ?? 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">Marketplace</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{cheapest?.discount ? `${cheapest.discount}%` : "—"}</p>
              <p className="text-xs text-gray-500 mt-0.5">Max Diskon</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-900">
                {product.prices?.some(p => p.rating)
                  ? Math.max(...product.prices.filter(p => p.rating).map(p => p.rating ?? 0)).toFixed(1)
                  : "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Rating Max</p>
            </div>
          </div>
        </div>
      </div>

      {product.prices?.length > 0 && <PriceComparisonTable product={product} />}

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Produk Serupa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
