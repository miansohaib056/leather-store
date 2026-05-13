import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StarRating } from "@/components/shared/star-rating";
import { formatDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Reviews" };

export default async function ReviewsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        select: { name: true, slug: true, images: { take: 1 } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <MessageSquare size={48} className="text-muted-foreground/30" />
        <h2 className="mt-4 text-lg font-semibold">No reviews yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your product reviews will appear here
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">My Reviews</h2>
      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{review.product.name}</p>
                <StarRating rating={review.rating} size={14} className="mt-1" />
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </span>
            </div>
            {review.title && <p className="mt-2 font-medium">{review.title}</p>}
            {review.comment && (
              <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
            )}
            <p className="mt-2 text-xs capitalize text-muted-foreground">
              Status: {review.status.toLowerCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
