import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="RIQUE - Home"
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 font-heading text-base font-bold text-white shadow-sm",
          variant === "light" && "from-amber-400 via-amber-500 to-amber-700"
        )}
      >
        R
      </span>
      <span
        className={cn(
          "font-heading text-xl font-bold tracking-[0.18em]",
          variant === "light" ? "text-white" : "text-foreground"
        )}
      >
        RIQUE
      </span>
    </Link>
  );
}
