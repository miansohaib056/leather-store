import { cn, formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  price: number | string;
  compareAtPrice?: number | string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({
  price,
  compareAtPrice,
  className,
  size = "md",
}: PriceDisplayProps) {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  const numericCompare = compareAtPrice
    ? typeof compareAtPrice === "string"
      ? parseFloat(compareAtPrice)
      : compareAtPrice
    : null;

  const isOnSale = numericCompare && numericCompare > numericPrice;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-medium",
          isOnSale && "text-red-600 dark:text-red-400",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-xl"
        )}
      >
        {formatPrice(numericPrice)}
      </span>
      {isOnSale && (
        <span
          className={cn(
            "text-muted-foreground line-through",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}
        >
          {formatPrice(numericCompare)}
        </span>
      )}
    </div>
  );
}
