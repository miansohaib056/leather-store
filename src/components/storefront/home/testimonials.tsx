"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "James Mitchell",
    location: "New York, USA",
    initial: "JM",
    rating: 5,
    text: "The quality of the bifold wallet exceeded my expectations. The leather has a beautiful patina after just a few months of use. Truly a premium product.",
    product: "Classic Bifold Wallet",
  },
  {
    name: "Sarah Thompson",
    location: "London, UK",
    initial: "ST",
    rating: 5,
    text: "I bought the messenger bag as a gift for my husband. He absolutely loves it. The craftsmanship is outstanding, and the leather is buttery soft.",
    product: "Messenger Bag",
  },
  {
    name: "Ahmed Hassan",
    location: "Dubai, UAE",
    initial: "AH",
    rating: 5,
    text: "Been buying from RIQUE for two years now. Every product feels luxurious. The attention to detail is what sets them apart from other brands.",
    product: "Heritage Belt",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-stone-50/60">
      <div className="container-wide">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Loved by 10,000+
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight md:text-5xl">
            What our customers say
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex h-full flex-col rounded-3xl border bg-background p-8 transition-all hover:shadow-xl hover:shadow-stone-900/5"
            >
              <Quote className="h-7 w-7 text-amber-700/30" strokeWidth={1.5} />

              <div className="mt-4 flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="fill-amber-500 text-amber-500"
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-stone-900 text-xs font-semibold text-white">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.location} · {t.product}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
