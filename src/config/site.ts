export const siteConfig = {
  name: "RIQUE",
  description:
    "Premium handcrafted leather goods. Wallets, belts, bags, and accessories made from the finest full-grain leather.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/images/og-image.jpg",
  creator: "RIQUE Leather",
  keywords: [
    "leather goods",
    "premium leather",
    "handcrafted leather",
    "leather wallet",
    "leather belt",
    "leather bag",
    "leather accessories",
    "luxury leather",
    "full grain leather",
  ],
  links: {
    instagram: "https://instagram.com/riqueleather",
    facebook: "https://facebook.com/riqueleather",
    tiktok: "https://tiktok.com/@riqueleather",
  },
  contact: {
    email: "hello@riqueleather.com",
    phone: "+1 (555) 000-0000",
  },
} as const;
