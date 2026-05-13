"use client";

import { Truck, ShieldCheck, RotateCcw, Award, Sparkles } from "lucide-react";

const items = [
  { icon: Truck, label: "Free Shipping over $150" },
  { icon: ShieldCheck, label: "2 Year Warranty" },
  { icon: RotateCcw, label: "30-Day Returns" },
  { icon: Award, label: "Handcrafted in Pakistan" },
  { icon: Sparkles, label: "Premium Full-Grain Leather" },
];

export function Marquee() {
  const repeated = [...items, ...items, ...items];

  return (
    <div className="border-y border-border/60 bg-foreground py-3 text-background">
      <div className="fade-edge overflow-hidden">
        <div className="animate-marquee flex w-max gap-12">
          {repeated.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] whitespace-nowrap">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
