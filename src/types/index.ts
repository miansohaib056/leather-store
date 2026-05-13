export type { UserRole } from "@prisma/client";
export type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ReviewStatus,
  DiscountType,
  BlogPostStatus,
} from "@prisma/client";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  price: number;
  image: string | null;
  quantity: number;
  slug: string;
  stock: number;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}
