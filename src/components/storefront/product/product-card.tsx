"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/price-display";
import { StarRating } from "@/components/shared/star-rating";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number | string;
    compareAtPrice?: number | string | null;
    images: { url: string; alt?: string | null }[];
    avgRating: number | string;
    reviewCount: number;
    material?: string | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, hasItem } = useWishlistStore();
  const isWishlisted = hasItem(product.id);
  const primaryImage = product.images[0];
  const hoverImage = product.images[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <Link href={`/products/${product.slug}`}>
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                className={cn(
                  "object-cover transition-opacity duration-500",
                  hoverImage && "group-hover:opacity-0"
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {hoverImage && (
                <Image
                  src={hoverImage.url}
                  alt={product.name}
                  fill
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag size={32} className="text-muted-foreground/40" />
            </div>
          )}
        </Link>

        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full shadow-md"
            onClick={() => toggleItem(product.id)}
          >
            <Heart
              size={16}
              className={cn(isWishlisted && "fill-red-500 text-red-500")}
            />
          </Button>
        </div>

        {product.compareAtPrice &&
          Number(product.compareAtPrice) > Number(product.basePrice) && (
            <div className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
              Sale
            </div>
          )}
      </div>

      <div className="mt-3 space-y-1">
        <Link
          href={`/products/${product.slug}`}
          className="block text-sm font-medium transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        {product.material && (
          <p className="text-xs text-muted-foreground">{product.material}</p>
        )}
        <div className="flex items-center justify-between">
          <PriceDisplay
            price={product.basePrice}
            compareAtPrice={product.compareAtPrice}
            size="sm"
          />
          {Number(product.avgRating) > 0 && (
            <StarRating
              rating={Number(product.avgRating)}
              size={12}
              showValue
              reviewCount={product.reviewCount}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
