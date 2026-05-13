"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  MapPin,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const isLoggedIn = mounted && !!session?.user;
  const isAdmin = mounted && session?.user?.role === "ADMIN";
  const initial =
    session?.user?.name?.[0]?.toUpperCase() ||
    session?.user?.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={isLoggedIn ? "Account menu" : "Sign in"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {isLoggedIn ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-xs font-semibold text-white shadow-sm">
            {initial}
          </span>
        ) : (
          <User size={20} strokeWidth={1.75} />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        {isLoggedIn ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium leading-none">
                {session?.user?.name || "User"}
              </p>
              <p className="mt-1 text-xs leading-none text-muted-foreground">
                {session?.user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/account")}>
              <User className="mr-2 h-4 w-4" />
              My Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/account/orders")}>
              <Package className="mr-2 h-4 w-4" />
              Orders
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/wishlist")}>
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/account/addresses")}>
              <MapPin className="mr-2 h-4 w-4" />
              Addresses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/account/reviews")}>
              <Star className="mr-2 h-4 w-4" />
              My Reviews
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/account/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/admin")}>
                  <ShieldCheck className="mr-2 h-4 w-4 text-amber-600" />
                  <span className="font-medium">Admin Dashboard</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">Welcome</p>
              <p className="text-xs text-muted-foreground">
                Sign in to access your account
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/login")}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/register")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
