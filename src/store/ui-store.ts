"use client";

import { create } from "zustand";

interface UIStore {
  isCartOpen: boolean;
  isMobileNavOpen: boolean;
  isSearchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  isMobileNavOpen: false,
  isSearchOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
