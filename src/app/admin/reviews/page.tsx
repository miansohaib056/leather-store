"use client";

import { useState, useEffect, useTransition } from "react";
import { Star, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StarRating } from "@/components/shared/star-rating";
import { getReviewsAdmin, moderateReview } from "@/actions/reviews";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: string;
  createdAt: string;
  user: { name: string | null; email: string };
  product: { name: string };
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getReviewsAdmin().then(setReviews);
  }, []);

  const handleModerate = (reviewId: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      try {
        await moderateReview(reviewId, status);
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
        );
        toast.success(`Review ${status.toLowerCase()}`);
      } catch {
        toast.error("Failed to update review");
      }
    });
  };

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-600",
    APPROVED: "text-green-600",
    REJECTED: "text-red-600",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Reviews</h1>
      <p className="text-sm text-muted-foreground">Moderate customer reviews</p>

      {reviews.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Star size={48} className="text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">No reviews yet</p>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.product.name}</TableCell>
                  <TableCell className="text-sm">
                    {review.user.name || review.user.email}
                  </TableCell>
                  <TableCell>
                    <StarRating rating={review.rating} size={12} />
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {review.title && <p className="text-sm font-medium">{review.title}</p>}
                    {review.comment && (
                      <p className="truncate text-sm text-muted-foreground">{review.comment}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={statusColors[review.status] || ""}>
                      {review.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {review.status === "PENDING" && (
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleModerate(review.id, "APPROVED")}
                          disabled={isPending}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleModerate(review.id, "REJECTED")}
                          disabled={isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
