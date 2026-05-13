import { prisma } from "@/lib/prisma";

export async function getStorefrontProducts({
  page = 1,
  limit = 12,
  categorySlug,
  sort = "newest",
  minPrice,
  maxPrice,
  material,
  search,
}: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  search?: string;
} = {}) {
  const where: Record<string, unknown> = {
    isActive: true,
    isArchived: false,
  };

  if (categorySlug) {
    where.categories = {
      some: { category: { slug: categorySlug } },
    };
  }

  if (minPrice || maxPrice) {
    where.basePrice = {};
    if (minPrice) (where.basePrice as Record<string, number>).gte = minPrice;
    if (maxPrice) (where.basePrice as Record<string, number>).lte = maxPrice;
  }

  if (material) {
    where.material = { contains: material, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { material: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Record<string, string> = {
    newest: "createdAt",
    "price-asc": "basePrice",
    "price-desc": "basePrice",
    popular: "totalSold",
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        categories: { include: { category: { select: { name: true, slug: true } } } },
        variants: { where: { isActive: true }, select: { stock: true, color: true, size: true } },
      },
      orderBy: {
        [orderBy[sort] || "createdAt"]: sort === "price-asc" ? "asc" : "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      categories: { include: { category: true } },
      variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getRelatedProducts(productId: string, categoryIds: string[], limit = 4) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      categories: { some: { categoryId: { in: categoryIds } } },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
    },
    take: limit,
  });
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
    },
    orderBy: { totalSold: "desc" },
    take: limit,
  });
}
