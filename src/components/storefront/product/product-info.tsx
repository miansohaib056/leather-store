"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PriceDisplay } from "@/components/shared/price-display";
import { StarRating } from "@/components/shared/star-rating";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    basePrice: { toString(): string };
    compareAtPrice: { toString(): string } | null;
    material: string | null;
    avgRating: { toString(): string };
    reviewCount: number;
    variants: {
      id: string;
      name: string;
      color: string | null;
      size: string | null;
      price: { toString(): string } | null;
      stock: number;
    }[];
    images: { url: string }[];
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, hasItem } = useWishlistStore();
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const price = selectedVariant?.price
    ? Number(selectedVariant.price.toString())
    : Number(product.basePrice.toString());
  const stock = selectedVariant?.stock ?? 0;
  const isInStock = product.variants.length === 0 || stock > 0;
  const isWishlisted = hasItem(product.id);

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariantId}`,
      productId: product.id,
      variantId: selectedVariantId,
      name: product.name,
      variantName: selectedVariant?.name || null,
      price,
      image: product.images[0]?.url || null,
      quantity,
      slug: product.slug,
      stock: stock || 999,
    });
    toast.success("Added to cart");
    setCartOpen(true);
  };

  return (
    <div className="flex flex-col">
      <div>
        {Number(product.avgRating.toString()) > 0 && (
          <StarRating
            rating={Number(product.avgRating.toString())}
            showValue
            reviewCount={product.reviewCount}
            className="mb-3"
          />
        )}

        <h1 className="font-heading text-3xl font-bold lg:text-4xl">{product.name}</h1>

        {product.material && (
          <p className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">
            {product.material}
          </p>
        )}

        <div className="mt-4">
          <PriceDisplay
            price={price}
            compareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice.toString()) : null}
            size="lg"
          />
        </div>

        {product.shortDescription && (
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        )}
      </div>

      <Separator className="my-6" />

      {product.variants.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium">
            Variant: <span className="text-muted-foreground">{selectedVariant?.name}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => {
                  setSelectedVariantId(variant.id);
                  setQuantity(1);
                }}
                disabled={variant.stock === 0}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm transition-all",
                  variant.id === selectedVariantId
                    ? "border-primary bg-primary text-primary-foreground"
                    : variant.stock === 0
                      ? "cursor-not-allowed border-muted text-muted-foreground line-through opacity-50"
                      : "hover:border-foreground"
                )}
              >
                {variant.name}
              </button>
            ))}
          </div>
          <Separator className="my-6" />
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-lg border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-lg hover:bg-muted"
          >
            -
          </button>
          <span className="w-12 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(quantity + 1, stock || 99))}
            className="px-3 py-2 text-lg hover:bg-muted"
          >
            +
          </button>
        </div>

        {isInStock && (
          <p className="text-sm text-muted-foreground">
            {stock > 0 && stock <= 10 ? `Only ${stock} left` : "In Stock"}
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock}
          size="lg"
          className="flex-1 rounded-none text-sm font-semibold uppercase tracking-wider"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="rounded-none"
          onClick={() => {
            toggleItem(product.id);
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
          }}
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-red-500 text-red-500")} />
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          { icon: Truck, label: "Free Shipping", sub: "Over $150" },
          { icon: Shield, label: "2 Year Warranty", sub: "Full coverage" },
          { icon: RotateCcw, label: "30-Day Returns", sub: "No questions" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <Icon size={20} className="text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-1.5 text-xs font-medium">{label}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
