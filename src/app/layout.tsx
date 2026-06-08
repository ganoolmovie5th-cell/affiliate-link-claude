import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HargaBandingin - Bandingkan Harga Shopee, Tokopedia & TikTok Shop",
  description:
    "Temukan harga terbaik dari official store Shopee, Tokopedia, dan TikTok Shop. Hemat lebih banyak dengan perbandingan harga real-time.",
  keywords: "bandingkan harga, shopee, tokopedia, tiktok shop, harga termurah, belanja online",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "HargaBandingin - Bandingkan Harga di 3 Marketplace Sekaligus",
    description: "Temukan harga terbaik dari official store Shopee, Tokopedia, dan TikTok Shop.",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/logo.svg", width: 200, height: 200, alt: "HargaBandingin" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
