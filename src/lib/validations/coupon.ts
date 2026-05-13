import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  discountValue: z.coerce.number().min(0),
  minimumPurchase: z.coerce.number().min(0).optional().nullable(),
  maximumDiscount: z.coerce.number().min(0).optional().nullable(),
  usageLimit: z.coerce.number().int().min(0).optional().nullable(),
  perUserLimit: z.coerce.number().int().min(0).default(1),
  isActive: z.boolean().default(true),
  startsAt: z.coerce.date(),
  expiresAt: z.coerce.date().optional().nullable(),
});

export type CouponInput = z.infer<typeof couponSchema>;
