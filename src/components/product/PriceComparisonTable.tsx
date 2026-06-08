"use client";

import { type Product, MARKETPLACE_CONFIG, type Marketplace } from "@/types";
import { getCheapestPrice, formatPrice } from "@/lib/products";
import { formatNumber } from "@/lib/utils";
import MarketplaceBadge from "@/components/ui/MarketplaceBadge";
import PriceTag from "@/components/ui/PriceTag";
import StarRating from "@/components/ui/StarRating";

interface Props {
  product: Product;
}

// Marketplace display order (for reference)
// const MARKETPLACE_ORDER: Marketplace[] = ["shopee", "tokopedia", "tiktok"];

export default function PriceComparisonTable({ product }: Props) {
  const cheapest = getCheapestPrice(product);

  const sortedPrices = [...product.prices].sort((a, b) => {
    if (!a.inStock) return 1;
    if (!b.inStock) return -1;
    return a.price - b.price;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Perbandingan Harga</h2>
        <span className="text-xs text-gray-400">Update otomatis setiap 12 jam</span>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {sortedPrices.map((priceData, idx) => {
          const isCheapest = cheapest?.marketplace === priceData.marketplace;
          const config = MARKETPLACE_CONFIG[priceData.marketplace];

          return (
            <div
              key={priceData.marketplace}
              className={`p-4 ${isCheapest ? "bg-blue-50" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <MarketplaceBadge marketplace={priceData.marketplace} size="sm" />
                    {isCheapest && priceData.inStock && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">
                        Termurah 🏆
                      </span>
                    )}
                  </div>
                  {priceData.inStock ? (
                    <PriceTag
                      price={priceData.price}
                      originalPrice={priceData.originalPrice}
                      discount={priceData.discount}
                      size="md"
                    />
                  ) : (
                    <span className="text-sm text-red-500 font-medium">Stok Habis</span>
                  )}
                  {priceData.rating && (
                    <StarRating rating={priceData.rating} />
                  )}
                  {priceData.sold && (
                    <span className="text-xs text-gray-400">{formatNumber(priceData.sold)} terjual</span>
                  )}
                </div>

                {priceData.inStock && (
                  <a
                    href={priceData.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isCheapest
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Beli di {config.name}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Marketplace</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Harga</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Rating</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Terjual</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedPrices.map((priceData) => {
              const isCheapest = cheapest?.marketplace === priceData.marketplace;
              const config = MARKETPLACE_CONFIG[priceData.marketplace];

              return (
                <tr
                  key={priceData.marketplace}
                  className={isCheapest && priceData.inStock ? "bg-blue-50" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MarketplaceBadge marketplace={priceData.marketplace} size="sm" />
                      {isCheapest && priceData.inStock && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">
                          🏆 Termurah
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {priceData.inStock ? (
                      <PriceTag
                        price={priceData.price}
                        originalPrice={priceData.originalPrice}
                        discount={priceData.discount}
                        size="md"
                      />
                    ) : (
                      <span className="text-sm text-red-500 font-medium">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {priceData.rating ? (
                      <StarRating rating={priceData.rating} />
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {priceData.sold ? formatNumber(priceData.sold) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {priceData.inStock ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Tersedia
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                        Habis
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {priceData.inStock ? (
                      <a
                        href={priceData.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          isCheapest
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Beli di {config.name}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-gray-300 text-sm">Tidak tersedia</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Affiliate disclaimer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          ⚠️ Link di atas menggunakan affiliate link. Kami mungkin mendapat komisi kecil jika kamu melakukan pembelian, tanpa biaya tambahan untukmu. Harga dapat berubah sewaktu-waktu.
        </p>
      </div>
    </div>
  );
}
