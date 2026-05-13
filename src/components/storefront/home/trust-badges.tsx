"use client";

import { motion } from "framer-motion";
import { Shield, Truck, RefreshCcw, Award } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $150",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "SSL encrypted checkout",
  },
  {
    icon: RefreshCcw,
    title: "30-Day Returns",
    description: "Hassle-free returns",
  },
  {
    icon: Award,
    title: "2-Year Warranty",
    description: "On all products",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y bg-background py-12">
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <badge.icon size={28} className="text-foreground" strokeWidth={1.5} />
              <h3 className="mt-3 text-sm font-semibold">{badge.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
