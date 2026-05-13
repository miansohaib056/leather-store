"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      parent: true,
      children: true,
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: { include: { _count: { select: { products: true } } } },
    },
  });
}

export async function createCategory(data: CategoryInput) {
  await requireAdmin();

  const validated = categorySchema.parse(data);

  const category = await prisma.category.create({
    data: {
      name: validated.name,
      slug: validated.slug || slugify(validated.name),
      description: validated.description,
      image: validated.image,
      parentId: validated.parentId,
      sortOrder: validated.sortOrder,
      isActive: validated.isActive,
      metaTitle: validated.metaTitle,
      metaDescription: validated.metaDescription,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return category;
}

export async function updateCategory(id: string, data: CategoryInput) {
  await requireAdmin();

  const validated = categorySchema.parse(data);

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: validated.name,
      slug: validated.slug || slugify(validated.name),
      description: validated.description,
      image: validated.image,
      parentId: validated.parentId,
      sortOrder: validated.sortOrder,
      isActive: validated.isActive,
      metaTitle: validated.metaTitle,
      metaDescription: validated.metaDescription,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath(`/categories/${category.slug}`);
  return category;
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}
