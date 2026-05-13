"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { DiscountType } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function getCoupons() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return coupons.map((c) => ({
    ...c,
    discountValue: c.discountValue.toString(),
    minimumPurchase: c.minimumPurchase?.toString() ?? null,
    maximumDiscount: c.maximumDiscount?.toString() ?? null,
    expiresAt: c.expiresAt?.toISOString() ?? null,
    startsAt: c.startsAt.toISOString(),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function createCoupon(data: {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  expiresAt?: string;
}) {
  await requireAdmin();

  await prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minimumPurchase: data.minimumPurchase,
      maximumDiscount: data.maximumDiscount,
      usageLimit: data.usageLimit,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
  });

  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}
