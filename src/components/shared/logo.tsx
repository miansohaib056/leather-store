import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "font-heading text-2xl font-bold tracking-[0.2em]",
          variant === "light" ? "text-white" : "text-foreground"
        )}
      >
        RIQUE
      </span>
    </Link>
  );
}
