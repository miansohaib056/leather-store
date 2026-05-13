"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "James Mitchell",
    location: "New York, USA",
    rating: 5,
    text: "The quality of the bifold wallet exceeded my expectations. The leather has a beautiful patina after just a few months of use. Truly a premium product.",
    product: "Classic Bifold Wallet",
  },
  {
    name: "Sarah Thompson",
    location: "London, UK",
    rating: 5,
    text: "I bought the messenger bag as a gift for my husband. He absolutely loves it. The craftsmanship is outstanding, and the leather is buttery soft.",
    product: "Messenger Bag",
  },
  {
    name: "Ahmed Hassan",
    location: "Dubai, UAE",
    rating: 5,
    text: "Been buying from RIQUE for two years now. Every product feels luxurious. The attention to detail is what sets them apart from other brands.",
    product: "Executive Belt",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-muted-foreground">
            Trusted by thousands of customers worldwide
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full border-0 bg-secondary/50">
                <CardContent className="p-8">
                  <Quote size={24} className="text-gold/40" />
                  <div className="mt-4 flex">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className="fill-gold text-gold"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="mt-6 border-t pt-4">
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.location} &middot; {testimonial.product}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
