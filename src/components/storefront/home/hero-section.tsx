"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[#1a1612]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1612]/90 via-[#1a1612]/60 to-transparent" />

      <div className="container-wide relative z-10">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-amber-200/80"
          >
            Handcrafted Excellence
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-5xl font-bold leading-[1.1] text-white md:text-6xl lg:text-7xl"
          >
            Leather Goods
            <br />
            <span className="text-amber-200">Built to Last</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-white/70"
          >
            Premium full-grain leather, meticulously crafted into timeless
            pieces. From wallets to bags, each product tells a story of
            tradition and quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/products"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-13 rounded-none bg-white px-8 text-sm font-semibold uppercase tracking-wider text-[#1a1612] hover:bg-white/90"
              )}
            >
              Shop Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/pages/our-craft"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-13 rounded-none border-white/30 px-8 text-sm font-semibold uppercase tracking-wider text-white hover:bg-white/10"
              )}
            >
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
