"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

// Cek apakah URL butuh proxy (domain eksternal yang mungkin block CORS)
function needsProxy(url: string): boolean {
  if (!url) return false;
  const externalDomains = [
    "tokopedia.net",
    "tokopedia-static.net",
    "shopee.co.id",
    "tiktokcdn.com",
    "samsung.com",
    "xiaomi.com",
    "realme.com",
  ];
  return externalDomains.some((domain) => url.includes(domain));
}

function getProxiedUrl(url: string): string {
  if (!url) return "";
  if (needsProxy(url)) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export default function ProductImage({ src, alt, className, fallbackText }: Props) {
  const [imgSrc, setImgSrc] = useState(getProxiedUrl(src));
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (!failed) {
      // Coba langsung tanpa proxy
      if (imgSrc.startsWith("/api/image-proxy")) {
        setImgSrc(src);
      } else {
        // Fallback ke placeholder
        setFailed(true);
      }
    }
  };

  if (failed || !src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 text-sm font-medium ${className}`}>
        {fallbackText || alt.split(" ")[0]}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}
