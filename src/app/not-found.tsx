import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-blue-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman tidak ditemukan</h1>
        <p className="text-gray-500 mb-8">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
