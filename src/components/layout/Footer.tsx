import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo-dark.svg" alt="HargaBandingin" className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Bandingkan harga dari official store Shopee, Tokopedia, dan TikTok Shop. 
              Hemat lebih banyak dengan perbandingan harga real-time.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs px-2 py-1 bg-orange-900/40 text-orange-400 rounded-md">Shopee</span>
              <span className="text-xs px-2 py-1 bg-green-900/40 text-green-400 rounded-md">Tokopedia</span>
              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-md">TikTok Shop</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Kategori</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories/smartphone" className="hover:text-white transition-colors">Smartphone</Link></li>
              <li><Link href="/categories/elektronik" className="hover:text-white transition-colors">Elektronik</Link></li>
              <li><Link href="/categories/kecantikan" className="hover:text-white transition-colors">Kecantikan</Link></li>
              <li><Link href="/categories/fashion" className="hover:text-white transition-colors">Fashion</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Info</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">© 2025 HargaBandingin. Semua harga bersifat indikatif.</p>
          <p className="text-xs">
            Link produk menggunakan affiliate link. Harga bisa berubah sewaktu-waktu.
          </p>
        </div>
      </div>
    </footer>
  );
}
