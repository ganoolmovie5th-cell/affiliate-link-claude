import Link from "next/link";
import { CATEGORIES } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-gray-700">Kategori</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Semua Kategori</h1>
        <p className="text-gray-500 mt-1">Telusuri produk berdasarkan kategori</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const count = MOCK_PRODUCTS.filter((p) => p.category === cat.slug).length;
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all p-6 flex flex-col items-center gap-3 text-center group"
            >
              <span className="text-5xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">{count} produk</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
