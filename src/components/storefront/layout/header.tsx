"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { mainNav } from "@/config/navigation";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UserMenu } from "./user-menu";

export function Header() {
  const cartItemCount = useCartStore((s) => s.itemCount);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { setMobileNavOpen, setSearchOpen, setCartOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
          : "border-b border-transparent bg-background"
      )}
    >
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Mobile: menu trigger */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="-ml-2"
            >
              <Menu size={22} />
            </Button>
          </div>

          {/* Desktop: logo + nav */}
          <div className="hidden lg:flex lg:items-center lg:gap-10">
            <Logo />
            <nav className="flex items-center gap-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile: centered logo */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
            <Logo />
          </div>

          {/* Right: search + actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="h-10 w-10 text-muted-foreground hover:text-foreground"
            >
              <Search size={20} strokeWidth={1.75} />
            </Button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative h-10 w-10 text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart size={20} strokeWidth={1.75} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold tabular-nums leading-none text-background">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <UserMenu />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative h-10 w-10 text-muted-foreground hover:text-foreground"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              {mounted && cartItemCount() > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-700 px-1 text-[10px] font-bold tabular-nums leading-none text-white">
                  {cartItemCount()}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
