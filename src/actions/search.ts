"use server";

import { prisma } from "@/lib/prisma";

export async function searchProducts(query: string) {
  const q = query.trim();
  if (q.length < 2) return [];

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { material: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
      ],
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    take: 6,
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    basePrice: Number(p.basePrice),
    material: p.material,
    image: p.images[0]?.url || null,
  }));
}
