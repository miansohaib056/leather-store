"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useUIStore } from "@/store/ui-store";
import { useEffect, useState } from "react";

export function SearchDialog() {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isSearchOpen, setSearchOpen]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <CommandInput
        placeholder="Search products, categories..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <CommandList>
        <CommandEmpty>
          {query ? "No results found." : "Start typing to search..."}
        </CommandEmpty>
        <CommandGroup heading="Quick Links">
          <CommandItem
            onSelect={() => {
              router.push("/products");
              setSearchOpen(false);
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            All Products
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/categories/wallets");
              setSearchOpen(false);
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            Wallets
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/categories/belts");
              setSearchOpen(false);
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            Belts
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/categories/bags");
              setSearchOpen(false);
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            Bags
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
