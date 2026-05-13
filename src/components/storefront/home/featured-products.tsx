"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/storefront/product/product-card";

const placeholderProducts = [
  {
    id: "1",
    name: "Classic Bifold Wallet",
    slug: "classic-bifold-wallet",
    basePrice: 89,
    compareAtPrice: 120,
    images: [
      { url: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=900&auto=format&fit=crop", alt: "Classic Bifold Wallet" },
      { url: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=900&auto=format&fit=crop", alt: "Classic Bifold Wallet alt" },
    ],
    avgRating: 4.8,
    reviewCount: 124,
    material: "Full Grain Leather",
  },
  {
    id: "2",
    name: "Heritage Belt",
    slug: "heritage-belt",
    basePrice: 75,
    compareAtPrice: null,
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop", alt: "Heritage Belt" },
    ],
    avgRating: 4.9,
    reviewCount: 89,
    material: "Vegetable Tanned",
  },
  {
    id: "3",
    name: "Weekender Duffle",
    slug: "weekender-duffle",
    basePrice: 349,
    compareAtPrice: 425,
    images: [
      { url: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=900&auto=format&fit=crop", alt: "Weekender Duffle" },
    ],
    avgRating: 4.9,
    reviewCount: 56,
    material: "Full Grain Leather",
  },
  {
    id: "4",
    name: "Slim Card Holder",
    slug: "slim-card-holder",
    basePrice: 49,
    compareAtPrice: null,
    images: [
      { url: "https://images.unsplash.com/photo-1612902456551-404b5b7c4040?q=80&w=900&auto=format&fit=crop", alt: "Slim Card Holder" },
    ],
    avgRating: 4.7,
    reviewCount: 203,
    material: "Top Grain Leather",
  },
];

interface DisplayProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice?: number | null;
  images: { url: string; alt?: string | null }[];
  avgRating: number;
  reviewCount: number;
  material?: string | null;
}

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  products?: DisplayProduct[];
}

export function FeaturedProducts({
  title = "Best Sellers",
  subtitle = "Our most loved pieces, chosen by customers worldwide",
  products,
}: FeaturedProductsProps) {
  const displayProducts: DisplayProduct[] =
    products && products.length > 0 ? products : placeholderProducts;

  return (
    <section className="section-padding bg-stone-50/60">
      <div className="container-wide">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Featured
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight md:text-5xl">
              {title}
            </h2>
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-amber-700"
          >
            View all products
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {displayProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
