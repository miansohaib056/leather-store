"use client";

import { X } from "lucide-react";
import { useState } from "react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="container-wide flex items-center justify-center py-2 text-center text-sm">
        <p className="font-medium tracking-wide">
          Free shipping on orders over $150 &mdash;{" "}
          <span className="underline underline-offset-4">Shop Now</span>
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 opacity-70 transition-opacity hover:opacity-100"
          aria-label="Close announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
