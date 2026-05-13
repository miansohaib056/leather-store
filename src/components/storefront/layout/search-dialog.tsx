"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, ArrowRight, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUIStore } from "@/store/ui-store";
import { useEffect, useState, useTransition } from "react";
import { searchProducts } from "@/actions/search";
import { formatPrice, cn } from "@/lib/utils";

interface ProductResult {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  material: string | null;
  image: string | null;
}

const popularSearches = [
  { label: "Wallets", href: "/categories/wallets" },
  { label: "Leather Bags", href: "/categories/bags" },
  { label: "Belts", href: "/categories/belts" },
  { label: "Card Holders", href: "/categories/accessories" },
];

export function SearchDialog() {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      startTransition(async () => {
        const data = await searchProducts(query);
        setResults(data);
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const navigate = (path: string) => {
    setSearchOpen(false);
    router.push(path);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Dialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="top-[12vh] max-w-2xl translate-y-0 overflow-hidden p-0 sm:rounded-xl">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <form onSubmit={handleSubmit} className="border-b">
          <div className="flex items-center gap-3 px-5 py-4">
            {isPending ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-muted-foreground" />
            ) : (
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for wallets, bags, belts..."
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
            />
            <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          </div>
        </form>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => navigate(item.href)}
                    className="rounded-full border bg-muted/40 px-4 py-1.5 text-sm transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 && !isPending ? (
            <div className="px-5 py-12 text-center">
              <Search className="mx-auto h-10 w-10 text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">
                No products match &quot;{query}&quot;
              </p>
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-4 text-sm font-medium text-foreground hover:underline"
              >
                Browse all products
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {results.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => navigate(`/products/${product.slug}`)}
                  className={cn(
                    "flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-muted/50"
                  )}
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Search className="h-4 w-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    {product.material && (
                      <p className="truncate text-xs text-muted-foreground">
                        {product.material}
                      </p>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {formatPrice(product.basePrice)}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}

              {query.trim().length >= 2 && (
                <button
                  type="button"
                  onClick={() => navigate(`/products?search=${encodeURIComponent(query.trim())}`)}
                  className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-amber-700 transition-colors hover:bg-muted/50"
                >
                  See all results for &quot;{query}&quot;
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
