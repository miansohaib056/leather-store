export const mainNav = [
  { label: "Shop", href: "/products" },
  { label: "Wallets", href: "/categories/wallets" },
  { label: "Bags", href: "/categories/bags" },
  { label: "Belts", href: "/categories/belts" },
  { label: "Accessories", href: "/categories/accessories" },
  { label: "Journal", href: "/blog" },
] as const;

export const footerNav = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Wallets", href: "/categories/wallets" },
    { label: "Belts", href: "/categories/belts" },
    { label: "Bags", href: "/categories/bags" },
    { label: "Accessories", href: "/categories/accessories" },
    { label: "New Arrivals", href: "/categories/new-arrivals" },
  ],
  company: [
    { label: "About Us", href: "/pages/about" },
    { label: "Our Craft", href: "/pages/our-craft" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Shipping & Returns", href: "/pages/shipping-returns" },
    { label: "Size Guide", href: "/pages/size-guide" },
    { label: "Care Instructions", href: "/pages/care-instructions" },
    { label: "FAQ", href: "/pages/faq" },
    { label: "Privacy Policy", href: "/pages/privacy-policy" },
    { label: "Terms of Service", href: "/pages/terms-of-service" },
  ],
} as const;
