"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { mainNav } from "@/config/navigation";
import { useUIStore } from "@/store/ui-store";
import { Separator } from "@/components/ui/separator";

export function MobileNav() {
  const { isMobileNavOpen, setMobileNavOpen } = useUIStore();
  const { data: session } = useSession();

  return (
    <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col px-6 py-4">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileNavOpen(false)}
              className="py-3 text-base font-medium text-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Separator className="my-4" />
          {session ? (
            <>
              <Link
                href="/account"
                onClick={() => setMobileNavOpen(false)}
                className="py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                My Account
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setMobileNavOpen(false)}
                className="py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Order History
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileNavOpen(false)}
                className="py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileNavOpen(false)}
                className="py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Create Account
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
