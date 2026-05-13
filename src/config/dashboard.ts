import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Star,
  Ticket,
  FileText,
  BookOpen,
  Image,
  Mail,
  BarChart3,
  Search,
  Settings,
} from "lucide-react";

export const adminNav = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: Ticket,
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: BookOpen,
  },
  {
    label: "Pages",
    href: "/admin/pages",
    icon: FileText,
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: Image,
  },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "SEO",
    href: "/admin/seo",
    icon: Search,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
] as const;
