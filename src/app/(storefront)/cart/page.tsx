"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container-wide section-padding">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag size={64} className="text-muted-foreground/30" />
          <h1 className="mt-6 font-heading text-3xl font-bold">Your Cart is Empty</h1>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven&apos;t added any items yet.
          </p>
          <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "mt-8 rounded-none")}>
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide section-padding">
      <h1 className="font-heading text-3xl font-bold md:text-4xl">Shopping Cart</h1>
      <p className="mt-2 text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y rounded-lg border">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 p-4 sm:p-6">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-32">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag size={24} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/products/${item.slug}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <p className="mt-0.5 text-sm text-muted-foreground">{item.variantName}</p>
                      )}
                      <p className="mt-1 text-sm font-medium">{formatPrice(item.price)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="p-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-lg border">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="px-3 py-1.5 hover:bg-muted"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="px-3 py-1.5 hover:bg-muted"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <Link href="/products" className={cn(buttonVariants({ variant: "ghost" }))}>
              Continue Shopping
            </Link>
            <Button variant="ghost" onClick={() => clearCart()}>
              Clear Cart
            </Button>
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <Separator className="my-4" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            <Link
              href="/checkout"
              className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full rounded-none text-sm font-semibold uppercase tracking-wider")}
            >
              Proceed to Checkout
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
