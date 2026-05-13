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
    <section className="border-y bg-background py-14">
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group flex items-center gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-100 transition-colors group-hover:bg-amber-700/10">
                  <Icon
                    size={20}
                    className="text-foreground transition-colors group-hover:text-amber-700"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{badge.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
