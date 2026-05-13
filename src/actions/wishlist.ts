"use server";

import { prisma } from "@/lib/prisma";

export async function getWishlistProducts(productIds: string[]) {
  if (productIds.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
    },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    basePrice: Number(p.basePrice),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    material: p.material,
    avgRating: Number(p.avgRating),
    reviewCount: p.reviewCount,
    images: p.images.map((img) => ({ url: img.url, alt: img.alt })),
  }));
}
