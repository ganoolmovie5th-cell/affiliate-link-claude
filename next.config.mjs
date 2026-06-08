/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.tokopedia.com" },
      { protocol: "https", hostname: "**.shopee.co.id" },
      { protocol: "https", hostname: "**.tiktok.com" },
      { protocol: "https", hostname: "**.tiktokcdn.com" },
      { protocol: "https", hostname: "**.tokopedia.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.samsung.com" },
      { protocol: "https", hostname: "**.xiaomi.com" },
      { protocol: "https", hostname: "**.realme.com" },
      { protocol: "https", hostname: "**.wardahbeauty.com" },
      { protocol: "https", hostname: "**.somethinc.com" },
      { protocol: "https", hostname: "**.appmifile.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.gstatic.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.cdn-shopify.com" },
    ],
  },
};

export default nextConfig;
