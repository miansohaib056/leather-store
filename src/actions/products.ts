"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getProducts({
  page = 1,
  limit = 20,
  search,
  categoryId,
  isActive,
}: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
} = {}) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categories = { some: { categoryId } };
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        categories: { include: { category: true } },
        variants: true,
        _count: { select: { orderItems: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      categories: { include: { category: true } },
      variants: { orderBy: { sortOrder: "asc" } },
      tags: { include: { tag: true } },
    },
  });
}

export async function createProduct(data: ProductInput) {
  await requireAdmin();

  const validated = productSchema.parse(data);

  const categoryIds = validated.categoryIds ?? [];
  const variants = validated.variants ?? [];

  const product = await prisma.product.create({
    data: {
      name: validated.name,
      slug: validated.slug || slugify(validated.name),
      description: validated.description,
      shortDescription: validated.shortDescription,
      basePrice: validated.basePrice,
      compareAtPrice: validated.compareAtPrice,
      costPrice: validated.costPrice,
      sku: validated.sku,
      barcode: validated.barcode,
      material: validated.material,
      careInstructions: validated.careInstructions,
      weight: validated.weight,
      isFeatured: validated.isFeatured ?? false,
      isActive: validated.isActive ?? true,
      metaTitle: validated.metaTitle,
      metaDescription: validated.metaDescription,
      categories: {
        create: categoryIds.map((categoryId) => ({
          categoryId,
        })),
      },
      variants: {
        create: variants.map((v) => ({
          name: v.name,
          sku: v.sku,
          color: v.color,
          size: v.size,
          price: v.price,
          stock: v.stock ?? 0,
          lowStockThreshold: v.lowStockThreshold ?? 5,
          isActive: v.isActive ?? true,
          sortOrder: v.sortOrder ?? 0,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return product;
}

export async function updateProduct(id: string, data: ProductInput) {
  await requireAdmin();

  const validated = productSchema.parse(data);

  await prisma.productCategory.deleteMany({ where: { productId: id } });

  const updateCategoryIds = validated.categoryIds ?? [];
  const updateVariants = validated.variants ?? [];

  const existing = await prisma.productVariant.findMany({ where: { productId: id } });
  const incomingIds = updateVariants.filter((v) => v.id).map((v) => v.id!);
  const toDelete = existing.filter((v) => !incomingIds.includes(v.id));

  if (toDelete.length > 0) {
    await prisma.productVariant.deleteMany({
      where: { id: { in: toDelete.map((v) => v.id) } },
    });
  }

  for (const variant of updateVariants) {
    if (variant.id) {
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: {
          name: variant.name,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          price: variant.price,
          stock: variant.stock ?? 0,
          lowStockThreshold: variant.lowStockThreshold ?? 5,
          isActive: variant.isActive ?? true,
          sortOrder: variant.sortOrder ?? 0,
        },
      });
    } else {
      await prisma.productVariant.create({
        data: {
          productId: id,
          name: variant.name,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          price: variant.price,
          stock: variant.stock ?? 0,
          lowStockThreshold: variant.lowStockThreshold ?? 5,
          isActive: variant.isActive ?? true,
          sortOrder: variant.sortOrder ?? 0,
        },
      });
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: validated.name,
      slug: validated.slug || slugify(validated.name),
      description: validated.description,
      shortDescription: validated.shortDescription,
      basePrice: validated.basePrice,
      compareAtPrice: validated.compareAtPrice,
      costPrice: validated.costPrice,
      sku: validated.sku,
      barcode: validated.barcode,
      material: validated.material,
      careInstructions: validated.careInstructions,
      weight: validated.weight,
      isFeatured: validated.isFeatured ?? false,
      isActive: validated.isActive ?? true,
      metaTitle: validated.metaTitle,
      metaDescription: validated.metaDescription,
      categories: {
        create: updateCategoryIds.map((categoryId) => ({
          categoryId,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/products");
  return product;
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function addProductImages(
  productId: string,
  images: { url: string; publicId: string; alt?: string }[]
) {
  await requireAdmin();

  const existingCount = await prisma.productImage.count({
    where: { productId },
  });

  await prisma.productImage.createMany({
    data: images.map((img, i) => ({
      productId,
      url: img.url,
      publicId: img.publicId,
      alt: img.alt,
      sortOrder: existingCount + i,
      isPrimary: existingCount === 0 && i === 0,
    })),
  });

  revalidatePath("/admin/products");
}

export async function deleteProductImage(imageId: string) {
  await requireAdmin();

  await prisma.productImage.delete({ where: { id: imageId } });

  revalidatePath("/admin/products");
}
