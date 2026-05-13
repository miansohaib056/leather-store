"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { mainNav } from "@/config/navigation";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const cartItemCount = useCartStore((s) => s.itemCount);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { setMobileNavOpen, setSearchOpen, setCartOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-background"
      )}
    >
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <div className="flex items-center gap-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </Button>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <Logo />
            <nav className="flex items-center gap-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="text-muted-foreground hover:text-foreground"
            >
              <Search size={20} />
            </Button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href={session ? "/account" : "/login"}
              aria-label={session ? "Account" : "Sign in"}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "text-muted-foreground hover:text-foreground"
              )}
            >
              <User size={20} />
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative text-muted-foreground hover:text-foreground"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {mounted && cartItemCount() > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
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
