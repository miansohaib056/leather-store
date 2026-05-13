"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { BlogPostStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: BlogPostStatus;
  metaTitle?: string;
  metaDescription?: string;
}) {
  const session = await requireAdmin();

  await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      status: data.status,
      authorId: session.user.id,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updateBlogPost(
  id: string,
  data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    status: BlogPostStatus;
    metaTitle?: string;
    metaDescription?: string;
  }
) {
  await requireAdmin();

  const existing = await prisma.blogPost.findUnique({ where: { id } });

  await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      status: data.status,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      publishedAt:
        data.status === "PUBLISHED" && existing?.status !== "PUBLISHED"
          ? new Date()
          : undefined,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function getBlogPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}
