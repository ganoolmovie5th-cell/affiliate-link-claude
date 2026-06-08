"use client";

import Link from "next/link";
import Image from "next/image";
import { getCheapestPrice, formatPrice } from "@/lib/products";
import { formatNumber } from "@/lib/utils";
import type { Product } from "@/types";
import { MARKETPLACE_CONFIG } from "@/types";
import MarketplaceBadge from "@/components/ui/MarketplaceBadge";
import StarRating from "@/components/ui/StarRating";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const cheapest = getCheapestPrice(product);
  const savings = cheapest?.originalPrice
    ? cheapest.originalPrice - cheapest.price
    : 0;

  return (
    <Link
      href={`/compare/${product.slug}`}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
        {cheapest?.discount && cheapest.discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{cheapest.discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{product.brand}</p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mt-0.5 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Cheapest price */}
        {cheapest && (
          <div className="mt-auto">
            <p className="text-xs text-gray-400 mb-1">Harga terbaik di</p>
            <div className="flex items-center gap-1.5 mb-2">
              <MarketplaceBadge marketplace={cheapest.marketplace} size="sm" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(cheapest.price)}
              </span>
              {cheapest.originalPrice && cheapest.originalPrice > cheapest.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(cheapest.originalPrice)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-xs text-green-600 font-medium mt-0.5">
                Hemat {formatPrice(savings)}
              </p>
            )}
          </div>
        )}

        {/* Available at */}
        <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">Tersedia di {product.prices.filter(p => p.inStock).length} marketplace</span>
        </div>
      </div>
    </Link>
  );
}
