export type Marketplace = "shopee" | "tokopedia" | "tiktok";

export interface MarketplacePrice {
  marketplace: Marketplace;
  price: number;
  originalPrice?: number;
  discount?: number;
  affiliateUrl: string;
  productUrl: string;
  inStock: boolean;
  rating?: number;
  sold?: number;
  lastUpdated: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  imageUrl: string;
  description: string;
  prices: MarketplacePrice[];
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  { id: "1", name: "Elektronik", slug: "elektronik", icon: "💻", count: 0 },
  { id: "2", name: "Smartphone", slug: "smartphone", icon: "📱", count: 0 },
  { id: "3", name: "Fashion", slug: "fashion", icon: "👗", count: 0 },
  { id: "4", name: "Kecantikan", slug: "kecantikan", icon: "💄", count: 0 },
  { id: "5", name: "Rumah & Dapur", slug: "rumah-dapur", icon: "🏠", count: 0 },
  { id: "6", name: "Olahraga", slug: "olahraga", icon: "⚽", count: 0 },
  { id: "7", name: "Otomotif", slug: "otomotif", icon: "🚗", count: 0 },
  { id: "8", name: "Makanan", slug: "makanan", icon: "🍜", count: 0 },
];

export const MARKETPLACE_CONFIG: Record<
  Marketplace,
  { name: string; color: string; bgColor: string; logo: string }
> = {
  shopee: {
    name: "Shopee",
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
    logo: "🛒",
  },
  tokopedia: {
    name: "Tokopedia",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    logo: "🏪",
  },
  tiktok: {
    name: "TikTok Shop",
    color: "text-gray-900",
    bgColor: "bg-gray-50 border-gray-200",
    logo: "🎵",
  },
};
