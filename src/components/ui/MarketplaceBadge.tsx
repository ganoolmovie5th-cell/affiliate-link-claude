import { MARKETPLACE_CONFIG, type Marketplace } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  marketplace: Marketplace;
  size?: "sm" | "md" | "lg";
  showLogo?: boolean;
}

export default function MarketplaceBadge({ marketplace, size = "md", showLogo = true }: Props) {
  const config = MARKETPLACE_CONFIG[marketplace];
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full border",
        config.bgColor,
        config.color,
        sizeClasses[size]
      )}
    >
      {showLogo && <span>{config.logo}</span>}
      {config.name}
    </span>
  );
}
