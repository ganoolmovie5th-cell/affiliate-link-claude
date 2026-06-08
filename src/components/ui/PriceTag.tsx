import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

interface Props {
  price: number;
  originalPrice?: number;
  discount?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function PriceTag({ price, originalPrice, discount, size = "md", className }: Props) {
  const sizeMap = {
    sm: { price: "text-base", original: "text-xs", badge: "text-xs px-1.5 py-0.5" },
    md: { price: "text-xl", original: "text-sm", badge: "text-xs px-1.5 py-0.5" },
    lg: { price: "text-2xl", original: "text-base", badge: "text-sm px-2 py-0.5" },
    xl: { price: "text-3xl", original: "text-lg", badge: "text-sm px-2 py-1" },
  };
  const s = sizeMap[size];

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex items-center gap-2">
        <span className={cn("font-bold text-gray-900", s.price)}>
          {formatPrice(price)}
        </span>
        {discount && discount > 0 && (
          <span className={cn("font-semibold text-red-600 bg-red-50 border border-red-200 rounded-md", s.badge)}>
            -{discount}%
          </span>
        )}
      </div>
      {originalPrice && originalPrice > price && (
        <span className={cn("text-gray-400 line-through", s.original)}>
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}
