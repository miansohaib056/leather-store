"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/shared/star-rating";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProductTabsProps {
  product: {
    description: string | null;
    careInstructions: string | null;
    material: string | null;
    weight: { toString(): string } | null;
    reviews: {
      id: string;
      rating: number;
      title: string | null;
      comment: string | null;
      createdAt: Date;
      user: { name: string | null; image: string | null };
    }[];
    reviewCount: number;
    avgRating: { toString(): string };
  };
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description">
      <TabsList className="w-full justify-start border-b bg-transparent p-0">
        <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
          Description
        </TabsTrigger>
        <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
          Details
        </TabsTrigger>
        <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
          Reviews ({product.reviewCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose prose-sm max-w-none text-muted-foreground">
          {product.description ? (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <p>No description available.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="details" className="mt-6">
        <div className="grid max-w-lg gap-3">
          {product.material && (
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-muted-foreground">Material</span>
              <span className="font-medium">{product.material}</span>
            </div>
          )}
          {product.weight && (
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-muted-foreground">Weight</span>
              <span className="font-medium">{Number(product.weight.toString())}g</span>
            </div>
          )}
          {product.careInstructions && (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium">Care Instructions</h4>
              <p className="text-sm text-muted-foreground">{product.careInstructions}</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        {product.reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {review.user.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{review.user.name}</p>
                      <StarRating rating={review.rating} size={12} />
                    </div>
                    {review.title && <p className="mt-1 font-medium">{review.title}</p>}
                    {review.comment && (
                      <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
