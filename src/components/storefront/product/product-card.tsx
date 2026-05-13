"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
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

  const onSale =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.basePrice);

  const discount = onSale
    ? Math.round(
        ((Number(product.compareAtPrice) - Number(product.basePrice)) /
          Number(product.compareAtPrice)) *
          100
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
        <Link
          href={`/products/${product.slug}`}
          className="block h-full w-full"
        >
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                className={cn(
                  "object-cover transition-all duration-700 ease-out group-hover:scale-105",
                  hoverImage && "group-hover:opacity-0"
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {hoverImage && (
                <Image
                  src={hoverImage.url}
                  alt={product.name}
                  fill
                  className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
              <ShoppingBag size={40} className="text-stone-400" />
            </div>
          )}
        </Link>

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {onSale && (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleItem(product.id);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-sm transition-all hover:scale-110 hover:bg-background"
        >
          <Heart
            size={16}
            className={cn(
              "transition-colors",
              isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"
            )}
          />
        </button>

        {/* Quick view CTA */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full bg-foreground/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-background opacity-0 backdrop-blur-sm transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-foreground"
        >
          <ShoppingBag size={14} />
          View Product
        </Link>
      </div>

      <div className="mt-4 space-y-1.5 px-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.slug}`}
              className="block truncate text-sm font-semibold transition-colors hover:text-amber-700"
            >
              {product.name}
            </Link>
            {product.material && (
              <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                {product.material}
              </p>
            )}
          </div>
          {Number(product.avgRating) > 0 && (
            <div className="shrink-0">
              <StarRating
                rating={Number(product.avgRating)}
                size={11}
                showValue
                reviewCount={product.reviewCount}
              />
            </div>
          )}
        </div>
        <PriceDisplay
          price={product.basePrice}
          compareAtPrice={product.compareAtPrice}
          size="sm"
        />
      </div>
    </motion.div>
  );
}
