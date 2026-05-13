export const dynamic = "force-dynamic";

import Link from "next/link";
import { FileText } from "lucide-react";
import { getPublishedPosts } from "@/actions/blog";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Leather care tips, styling guides, and behind-the-scenes stories from RIQUE.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return (
      <div className="container-wide section-padding">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText size={64} className="text-muted-foreground/30" />
          <h1 className="mt-6 font-heading text-3xl font-bold">Blog Coming Soon</h1>
          <p className="mt-2 text-muted-foreground">
            We&apos;re working on some great content for you.
          </p>
          <Link
            href="/products"
            className={cn(buttonVariants({ size: "lg" }), "mt-8 rounded-none")}
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide section-padding">
      <h1 className="font-heading text-3xl font-bold md:text-4xl">Blog</h1>
      <p className="mt-2 text-muted-foreground">
        Leather care, styling tips, and stories from our workshop
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-lg border transition-colors hover:bg-muted/50"
          >
            {post.coverImage && (
              <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5">
              <p className="text-xs text-muted-foreground">
                {post.publishedAt ? formatDate(post.publishedAt) : ""}
              </p>
              <h2 className="mt-1 font-heading text-xl font-bold group-hover:underline">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
