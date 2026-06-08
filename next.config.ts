import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.tokopedia.com" },
      { protocol: "https", hostname: "**.shopee.co.id" },
      { protocol: "https", hostname: "**.tiktok.com" },
      { protocol: "https", hostname: "**.tiktokcdn.com" },
      { protocol: "https", hostname: "**.tokopedia.net" },
    ],
  },
};

export default nextConfig;
