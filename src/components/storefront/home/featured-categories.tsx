"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Wallets",
    slug: "wallets",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    description: "Slim, bifold & card holders",
  },
  {
    name: "Belts",
    slug: "belts",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    description: "Dress & casual belts",
  },
  {
    name: "Bags",
    slug: "bags",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    description: "Messenger, tote & duffel",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image:
      "https://images.unsplash.com/photo-1612902456551-404b5b7c4040?q=80&w=800&auto=format&fit=crop",
    description: "Keychains, cardholders & more",
  },
];

export function FeaturedCategories() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-3 text-muted-foreground">
            Explore our curated collection of premium leather goods
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-semibold text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    {category.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-sm font-medium text-white transition-all group-hover:gap-2">
                    Shop Now
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
