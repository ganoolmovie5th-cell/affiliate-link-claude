import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "HargaBandingin - Bandingkan Harga Shopee, Tokopedia & TikTok Shop",
  description:
    "Temukan harga terbaik dari official store Shopee, Tokopedia, dan TikTok Shop. Hemat lebih banyak dengan perbandingan harga real-time.",
  keywords: "bandingkan harga, shopee, tokopedia, tiktok shop, harga termurah, belanja online",
  openGraph: {
    title: "HargaBandingin - Bandingkan Harga di 3 Marketplace Sekaligus",
    description: "Temukan harga terbaik dari official store Shopee, Tokopedia, dan TikTok Shop.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
