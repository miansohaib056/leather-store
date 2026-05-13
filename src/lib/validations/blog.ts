import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional().nullable(),
  coverImagePublicId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).default([]),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
