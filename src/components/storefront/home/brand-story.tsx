"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function BrandStory() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative lg:col-span-6"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1531926733929-0e1c0e30ed21?q=80&w=1200&auto=format&fit=crop"
                alt="Leather craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -bottom-6 -right-6 hidden rounded-3xl border-8 border-background bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 p-8 text-center shadow-xl lg:block"
            >
              <p className="font-heading text-5xl font-bold text-white">25+</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                Years of Craft
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Our Heritage
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight md:text-5xl">
              A legacy of leather mastery
            </h2>
            <div className="mt-6 space-y-4 text-base text-muted-foreground">
              <p>
                For over two decades, our family has been dedicated to the art
                of leather crafting. What began as a small workshop has grown
                into a brand trusted by thousands worldwide.
              </p>
              <p>
                Every piece we create is a testament to our commitment to
                quality — only the finest full-grain leather, skilled artisans,
                and exacting standards that get better with every passing year.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-y border-border/60 py-6">
              {[
                { value: "10K+", label: "Customers" },
                { value: "100%", label: "Genuine" },
                { value: "2 Year", label: "Warranty" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/blog"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-amber-700"
            >
              Read our story
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
