"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BrandStory() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-lg">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1531926733929-0e1c0e30ed21?q=80&w=1000&auto=format&fit=crop')",
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-lg border-4 border-background bg-primary p-8 text-center lg:block">
              <p className="font-heading text-4xl font-bold text-primary-foreground">
                25+
              </p>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Years of Craft
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
              Our Heritage
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold md:text-4xl">
              A Legacy of
              <br />
              Leather Mastery
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                For over two decades, our family has been dedicated to the art
                of leather crafting. What began as a small workshop has grown
                into a brand trusted by thousands worldwide.
              </p>
              <p>
                Every piece we create is a testament to our commitment to
                quality. We source only the finest full-grain leather, work
                with skilled artisans, and ensure that each stitch meets our
                exacting standards.
              </p>
              <p>
                From the careful selection of hides to the final quality
                inspection, every step in our process reflects generations of
                expertise passed down through our family.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { value: "10K+", label: "Happy Customers" },
                { value: "100%", label: "Genuine Leather" },
                { value: "2 Year", label: "Warranty" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/pages/our-craft"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 rounded-none"
              )}
            >
              Read Our Story
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
