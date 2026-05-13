"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ReviewStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function getReviewsAdmin() {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function moderateReview(reviewId: string, status: ReviewStatus) {
  await requireAdmin();

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
    include: { product: { select: { id: true } } },
  });

  if (status === "APPROVED") {
    const stats = await prisma.review.aggregate({
      where: { productId: review.productId, status: "APPROVED" },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        avgRating: stats._avg.rating ?? 0,
        reviewCount: stats._count,
      },
    });
  }

  revalidatePath("/admin/reviews");
}
