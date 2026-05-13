"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Star, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/3 translate-y-1/3 rounded-full bg-stone-300/20 blur-3xl" />

      <div className="container-wide relative">
        <div className="grid items-center gap-10 py-16 md:py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
          {/* Left: Copy */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/60 px-3 py-1.5 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-700" />
              <span className="text-xs font-medium tracking-wide text-foreground/70">
                New Spring Collection · 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight text-foreground md:text-6xl lg:text-7xl xl:text-[5.5rem]"
            >
              Crafted leather.
              <br />
              <span className="text-gradient-warm">Built to outlast</span>
              <br />
              every trend.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              Premium full-grain leather goods, handmade by master artisans.
              Wallets, bags, and accessories that age beautifully and last decades —
              not seasons.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group h-12 rounded-full bg-foreground px-7 text-sm font-semibold text-background hover:bg-foreground/90"
                )}
              >
                Shop the Collection
                <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/blog"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "h-12 rounded-full px-6 text-sm font-medium"
                )}
              >
                Our Craft Story
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex items-center gap-6 border-t border-border/60 pt-6"
            >
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  4.9/5 · 10,000+ reviews
                </p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-sm font-semibold">25+ Years</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Of craftsmanship
                </p>
              </div>
              <div className="hidden h-10 w-px bg-border sm:block" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Orders over $150
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Image grid */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative grid grid-cols-12 grid-rows-6 gap-3 sm:gap-4"
            >
              <div className="relative col-span-7 row-span-4 overflow-hidden rounded-2xl bg-muted shadow-lg shadow-stone-900/10">
                <Image
                  src="https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=900&auto=format&fit=crop"
                  alt="Leather bag"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="relative col-span-5 row-span-3 overflow-hidden rounded-2xl bg-muted shadow-lg shadow-stone-900/10">
                <Image
                  src="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop"
                  alt="Leather wallet"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative col-span-5 row-span-3 overflow-hidden rounded-2xl bg-muted shadow-lg shadow-stone-900/10">
                <Image
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"
                  alt="Leather belt"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative col-span-7 row-span-2 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 to-stone-900 p-5 shadow-lg shadow-stone-900/10">
                <div className="grain absolute inset-0" />
                <div className="relative text-center text-white">
                  <p className="font-heading text-3xl font-bold">RIQUE</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                    Since 2001
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
