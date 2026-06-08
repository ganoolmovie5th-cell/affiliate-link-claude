"use client";

import { useState } from "react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatPrice, getCheapestPrice } from "@/lib/products";
import type { Product, Marketplace } from "@/types";
import { CATEGORIES, MARKETPLACE_CONFIG } from "@/types";
import AdminProductForm from "./AdminProductForm";
import Link from "next/link";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = (product: Product) => {
    setProducts((prev) => [{ ...product, id: Date.now().toString() }, ...prev]);
    setView("list");
  };

  const handleEdit = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    setView("list");
    setEditProduct(null);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  if (view === "add") {
    return (
      <AdminProductForm
        onSubmit={handleAdd}
        onCancel={() => setView("list")}
        title="Tambah Produk Baru"
      />
    );
  }

  if (view === "edit" && editProduct) {
    return (
      <AdminProductForm
        product={editProduct}
        onSubmit={handleEdit}
        onCancel={() => { setView("list"); setEditProduct(null); }}
        title="Edit Produk"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola produk dan harga marketplace</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
            ← Lihat Website
          </Link>
          <button
            onClick={() => setView("add")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Produk", value: products.length, icon: "📦", color: "blue" },
          { label: "Produk Featured", value: products.filter(p => p.featured).length, icon: "⭐", color: "yellow" },
          { label: "Kategori Aktif", value: new Set(products.map(p => p.category)).size, icon: "🏷️", color: "purple" },
          { label: "Marketplace", value: 3, icon: "🛒", color: "green" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Daftar Produk ({products.length})</h2>
          <p className="text-xs text-gray-400">Data sementara (mock). Hubungkan Firebase untuk persistent storage.</p>
        </div>

        {/* Mobile list */}
        <div className="md:hidden divide-y divide-gray-100">
          {products.map((product) => {
            const cheapest = getCheapestPrice(product);
            return (
              <div key={product.id} className="p-4 flex items-start gap-3">
                <img src={product.imageUrl} alt={product.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.brand} · {product.category}</p>
                  {cheapest && (
                    <p className="text-sm font-bold text-blue-600 mt-1">{formatPrice(cheapest.price)}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => { setEditProduct(product); setView("edit"); }} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg font-medium hover:bg-blue-100">Edit</button>
                  <button onClick={() => setDeleteId(product.id)} className="text-xs bg-red-50 text-red-500 px-2.5 py-1.5 rounded-lg font-medium hover:bg-red-100">Hapus</button>
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
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Produk</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Kategori</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Harga Terbaik</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Marketplace</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const cheapest = getCheapestPrice(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-xs">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {cheapest ? (
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{formatPrice(cheapest.price)}</p>
                          <p className="text-xs text-gray-400 capitalize">{cheapest.marketplace}</p>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {product.prices.map((p) => (
                          <span key={p.marketplace} className={`text-xs px-1.5 py-0.5 rounded ${p.inStock ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                            {MARKETPLACE_CONFIG[p.marketplace].logo}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.featured ? (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">Featured</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">Normal</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditProduct(product); setView("edit"); }}
                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Hapus Produk?</h3>
              <p className="text-sm text-gray-500 mb-5">Produk ini akan dihapus secara permanen dan tidak bisa dikembalikan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Batal
                </button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold text-white transition-colors">
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
