"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product/product-card";
import { useWishlistStore } from "@/store/wishlist-store";
import { getWishlistProducts } from "@/actions/wishlist";
import { cn } from "@/lib/utils";

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice: number | null;
  material: string | null;
  avgRating: number;
  reviewCount: number;
  images: { url: string; alt: string | null }[];
}

export default function WishlistPage() {
  const { items: wishlistIds } = useWishlistStore();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    getWishlistProducts(wishlistIds).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [wishlistIds]);

  if (loading) {
    return (
      <div className="container-wide section-padding">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">Wishlist</h1>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="mt-3 h-4 w-2/3 rounded bg-muted" />
              <div className="mt-2 h-4 w-1/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container-wide section-padding">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart size={64} className="text-muted-foreground/30" />
          <h1 className="mt-6 font-heading text-3xl font-bold">Your Wishlist is Empty</h1>
          <p className="mt-2 text-muted-foreground">
            Save items you love for later
          </p>
          <Link
            href="/products"
            className={cn(buttonVariants({ size: "lg" }), "mt-8 rounded-none")}
          >
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide section-padding">
      <h1 className="font-heading text-3xl font-bold md:text-4xl">Wishlist</h1>
      <p className="mt-2 text-muted-foreground">{products.length} item{products.length !== 1 ? "s" : ""}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
