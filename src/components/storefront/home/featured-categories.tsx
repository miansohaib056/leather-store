"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Wallets",
    slug: "wallets",
    count: "24 items",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=900&auto=format&fit=crop",
    description: "Slim, bifold & card holders",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    name: "Bags",
    slug: "bags",
    count: "18 items",
    image:
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=900&auto=format&fit=crop",
    description: "Messenger, tote & duffel",
    span: "lg:col-span-2",
  },
  {
    name: "Belts",
    slug: "belts",
    count: "12 items",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop",
    description: "Dress & casual belts",
    span: "lg:col-span-1",
  },
  {
    name: "Accessories",
    slug: "accessories",
    count: "32 items",
    image:
      "https://images.unsplash.com/photo-1612902456551-404b5b7c4040?q=80&w=900&auto=format&fit=crop",
    description: "Keychains, cardholders & more",
    span: "lg:col-span-1",
  },
];

export function FeaturedCategories() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              The Collection
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight md:text-5xl">
              Shop by category
            </h2>
            <p className="mt-3 text-muted-foreground">
              Discover handcrafted leather goods organized to your style.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-amber-700"
          >
            Browse all products
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {categories.map((category, i) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={category.span}
            >
              <Link
                href={`/categories/${category.slug}`}
                className={`group relative block h-full min-h-[260px] overflow-hidden rounded-2xl bg-stone-900 ${
                  category.span?.includes("row-span") ? "lg:min-h-[540px]" : ""
                }`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-700/0 to-amber-700/0 transition-all duration-500 group-hover:from-amber-700/15 group-hover:to-stone-900/20" />

                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all group-hover:bg-white group-hover:text-stone-900">
                  <ArrowUpRight className="h-4 w-4 text-white transition-colors group-hover:text-stone-900" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                    {category.count}
                  </p>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-white md:text-3xl">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
