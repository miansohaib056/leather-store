"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  Banknote,
  Loader2,
  ShoppingBag,
  ArrowRight,
  Tag,
  X,
  Truck,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/store/cart-store";
import { createOrder, applyCoupon } from "@/actions/checkout";
import { shippingSchema, type ShippingInput } from "@/lib/validations/checkout";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [isPending, startTransition] = useTransition();
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "COD">("STRIPE");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    description: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ShippingInput>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: "PK",
      saveAddress: false,
    },
  });

  const sub = subtotal();
  const discount = appliedCoupon?.discount ?? 0;
  const shipping = sub >= 150 ? 0 : 15;
  const total = sub - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="container-wide section-padding">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag size={64} className="text-muted-foreground/30" />
          <h1 className="mt-6 font-heading text-3xl font-bold">Your Cart is Empty</h1>
          <p className="mt-2 text-muted-foreground">Add some items before checking out.</p>
          <Link
            href="/products"
            className={cn(buttonVariants({ size: "lg" }), "mt-8 rounded-none")}
          >
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const result = await applyCoupon(couponCode.trim(), sub);
      if (result.error) {
        toast.error(result.error);
      } else {
        setAppliedCoupon({
          code: result.code!,
          discount: result.discount!,
          description: result.description!,
        });
        toast.success("Coupon applied!");
      }
    } catch {
      toast.error("Failed to apply coupon.");
    }
    setCouponLoading(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const onSubmit = (data: ShippingInput) => {
    startTransition(async () => {
      try {
        const result = await createOrder({
          shipping: data,
          payment: {
            method: paymentMethod,
            couponCode: appliedCoupon?.code,
          },
          items,
        });

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.url) {
          clearCart();
          window.location.href = result.url;
          return;
        }

        if (result.orderId) {
          clearCart();
          router.push(`/checkout/success?orderId=${result.orderId}`);
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div className="container-wide section-padding">
      <h1 className="font-heading text-3xl font-bold md:text-4xl">Checkout</h1>
      <p className="mt-2 text-muted-foreground">Complete your order</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Shipping Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  {...register("fullName")}
                  className="mt-1"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+92 300 0000000"
                  {...register("phone")}
                  className="mt-1"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="PK"
                  {...register("country")}
                  className="mt-1"
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-destructive">{errors.country.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  placeholder="123 Main St"
                  {...register("addressLine1")}
                  className="mt-1"
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-sm text-destructive">{errors.addressLine1.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  placeholder="Apt, Suite, Floor"
                  {...register("addressLine2")}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Lahore"
                  {...register("city")}
                  className="mt-1"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  placeholder="Punjab"
                  {...register("state")}
                  className="mt-1"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-destructive">{errors.state.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="54000"
                  {...register("postalCode")}
                  className="mt-1"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-destructive">{errors.postalCode.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Special delivery instructions..."
                  {...register("notes")}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2 sm:col-span-2">
                <Checkbox
                  id="saveAddress"
                  checked={watch("saveAddress")}
                  onCheckedChange={(checked) => setValue("saveAddress", !!checked)}
                />
                <Label htmlFor="saveAddress" className="cursor-pointer text-sm">
                  Save this address for future orders
                </Label>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Payment Method</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("STRIPE")}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-4 text-left transition-all",
                  paymentMethod === "STRIPE"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-foreground/30"
                )}
              >
                <CreditCard
                  size={24}
                  className={paymentMethod === "STRIPE" ? "text-primary" : "text-muted-foreground"}
                />
                <div>
                  <p className="font-medium">Credit / Debit Card</p>
                  <p className="text-sm text-muted-foreground">Pay securely with Stripe</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-4 text-left transition-all",
                  paymentMethod === "COD"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-foreground/30"
                )}
              >
                <Banknote
                  size={24}
                  className={paymentMethod === "COD" ? "text-primary" : "text-muted-foreground"}
                />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when you receive</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-24 rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <Separator className="my-4" />

            <div className="max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-3"
                >
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded bg-muted">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingBag size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium leading-tight">{item.name}</p>
                    {item.variantName && (
                      <p className="text-xs text-muted-foreground">{item.variantName}</p>
                    )}
                    <p className="text-muted-foreground">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded bg-primary/5 px-3 py-2 text-sm">
                  <div>
                    <span className="font-medium">{appliedCoupon.code}</span>
                    <span className="ml-2 text-muted-foreground">{appliedCoupon.description}</span>
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-muted-foreground hover:text-destructive">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(sub)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="flex items-center gap-1">
                  {shipping === 0 ? (
                    <>
                      <Truck size={14} className="text-green-600" />
                      <span className="text-green-600">Free</span>
                    </>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="mt-6 w-full rounded-none text-sm font-semibold uppercase tracking-wider"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : paymentMethod === "STRIPE" ? (
                "Pay with Stripe"
              ) : (
                "Place Order (COD)"
              )}
            </Button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              {paymentMethod === "STRIPE"
                ? "You will be redirected to Stripe to complete payment"
                : "Pay in cash when your order is delivered"}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
