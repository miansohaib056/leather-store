"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product/product-card";
import { cn } from "@/lib/utils";

const placeholderProducts = [
  {
    id: "1",
    name: "Classic Bifold Wallet",
    slug: "classic-bifold-wallet",
    basePrice: 89,
    compareAtPrice: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop",
        alt: "Classic Bifold Wallet",
      },
    ],
    avgRating: 4.8,
    reviewCount: 124,
    material: "Full Grain Leather",
  },
  {
    id: "2",
    name: "Executive Belt",
    slug: "executive-belt",
    basePrice: 65,
    compareAtPrice: 85,
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
        alt: "Executive Belt",
      },
    ],
    avgRating: 4.9,
    reviewCount: 89,
    material: "Full Grain Leather",
  },
  {
    id: "3",
    name: "Messenger Bag",
    slug: "messenger-bag",
    basePrice: 249,
    compareAtPrice: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
        alt: "Messenger Bag",
      },
    ],
    avgRating: 4.7,
    reviewCount: 56,
    material: "Vegetable Tanned",
  },
  {
    id: "4",
    name: "Slim Card Holder",
    slug: "slim-card-holder",
    basePrice: 45,
    compareAtPrice: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1612902456551-404b5b7c4040?q=80&w=600&auto=format&fit=crop",
        alt: "Slim Card Holder",
      },
    ],
    avgRating: 4.6,
    reviewCount: 203,
    material: "Top Grain Leather",
  },
];

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  products?: typeof placeholderProducts;
}

export function FeaturedProducts({
  title = "Best Sellers",
  subtitle = "Our most loved pieces, chosen by customers worldwide",
  products,
}: FeaturedProductsProps) {
  const displayProducts = products || placeholderProducts;

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold md:text-4xl">{title}</h2>
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
          </div>
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "hidden md:inline-flex"
            )}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
