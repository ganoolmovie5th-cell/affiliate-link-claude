"use client";

import { useState } from "react";
import type { Product, MarketplacePrice, Marketplace } from "@/types";
import { CATEGORIES, MARKETPLACE_CONFIG } from "@/types";
import { slugify } from "@/lib/utils";

interface Props {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  title: string;
}

const defaultPrice = (marketplace: Marketplace): MarketplacePrice => ({
  marketplace,
  price: 0,
  originalPrice: undefined,
  discount: undefined,
  affiliateUrl: "",
  productUrl: "",
  inStock: true,
  rating: undefined,
  sold: undefined,
  lastUpdated: new Date().toISOString(),
});

export default function AdminProductForm({ product, onSubmit, onCancel, title }: Props) {
  const [name, setName] = useState(product?.name || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [category, setCategory] = useState(product?.category || "smartphone");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [description, setDescription] = useState(product?.description || "");
  const [featured, setFeatured] = useState(product?.featured || false);
  const [tags, setTags] = useState(product?.tags?.join(", ") || "");
  const [prices, setPrices] = useState<MarketplacePrice[]>(
    product?.prices || (["shopee", "tokopedia", "tiktok"] as Marketplace[]).map(defaultPrice)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updatePrice = (marketplace: Marketplace, field: keyof MarketplacePrice, value: string | number | boolean) => {
    setPrices((prev) =>
      prev.map((p) => (p.marketplace === marketplace ? { ...p, [field]: value } : p))
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nama produk wajib diisi";
    if (!brand.trim()) e.brand = "Brand wajib diisi";
    if (!imageUrl.trim()) e.imageUrl = "URL gambar wajib diisi";
    prices.forEach((p) => {
      if (p.inStock && p.price <= 0) e[`price_${p.marketplace}`] = "Harga harus lebih dari 0";
      if (p.inStock && !p.affiliateUrl.trim()) e[`affiliate_${p.marketplace}`] = "Affiliate URL wajib diisi";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      id: product?.id || Date.now().toString(),
      name: name.trim(),
      slug: slugify(name),
      brand: brand.trim(),
      category,
      imageUrl: imageUrl.trim(),
      description: description.trim(),
      featured,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      prices,
      createdAt: product?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onCancel} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">Isi semua informasi produk dan harga per marketplace</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Informasi Produk</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Produk *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Samsung Galaxy S24 256GB"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.name ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              {name && <p className="text-xs text-gray-400 mt-1">Slug: <code className="bg-gray-100 px-1 rounded">{slugify(name)}</code></p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand *</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Samsung"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.brand ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Gambar Produk *</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.imageUrl ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt="preview" className="w-20 h-20 rounded-xl object-cover border border-gray-200" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat produk..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (pisah dengan koma)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="samsung, flagship, android"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
              <span className="text-sm font-medium text-gray-700">Tampilkan sebagai Featured</span>
            </div>
          </div>
        </div>

        {/* Prices per marketplace */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900">Harga per Marketplace</h2>
          {prices.map((priceData) => {
            const config = MARKETPLACE_CONFIG[priceData.marketplace];
            return (
              <div key={priceData.marketplace} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.logo}</span>
                    <h3 className="font-semibold text-gray-900">{config.name}</h3>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={priceData.inStock}
                      onChange={(e) => updatePrice(priceData.marketplace, "inStock", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-600">Tersedia / In Stock</span>
                  </label>
                </div>

                {priceData.inStock && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Harga Jual (Rp) *</label>
                      <input
                        type="number"
                        value={priceData.price || ""}
                        onChange={(e) => updatePrice(priceData.marketplace, "price", Number(e.target.value))}
                        placeholder="10999000"
                        min={0}
                        className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`price_${priceData.marketplace}`] ? "border-red-400" : "border-gray-300"}`}
                      />
                      {errors[`price_${priceData.marketplace}`] && <p className="text-red-500 text-xs mt-1">{errors[`price_${priceData.marketplace}`]}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Harga Normal (Rp)</label>
                      <input
                        type="number"
                        value={priceData.originalPrice || ""}
                        onChange={(e) => updatePrice(priceData.marketplace, "originalPrice", Number(e.target.value))}
                        placeholder="12999000"
                        min={0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Diskon (%)</label>
                      <input
                        type="number"
                        value={priceData.discount || ""}
                        onChange={(e) => updatePrice(priceData.marketplace, "discount", Number(e.target.value))}
                        placeholder="15"
                        min={0}
                        max={100}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Affiliate URL *</label>
                      <input
                        type="url"
                        value={priceData.affiliateUrl}
                        onChange={(e) => updatePrice(priceData.marketplace, "affiliateUrl", e.target.value)}
                        placeholder="https://shopee.co.id/..."
                        className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`affiliate_${priceData.marketplace}`] ? "border-red-400" : "border-gray-300"}`}
                      />
                      {errors[`affiliate_${priceData.marketplace}`] && <p className="text-red-500 text-xs mt-1">{errors[`affiliate_${priceData.marketplace}`]}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        value={priceData.rating || ""}
                        onChange={(e) => updatePrice(priceData.marketplace, "rating", Number(e.target.value))}
                        placeholder="4.8"
                        min={1}
                        max={5}
                        step={0.1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Jumlah Terjual</label>
                      <input
                        type="number"
                        value={priceData.sold || ""}
                        onChange={(e) => updatePrice(priceData.marketplace, "sold", Number(e.target.value))}
                        placeholder="1500"
                        min={0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            {product ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}
