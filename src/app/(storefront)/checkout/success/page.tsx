import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getOrderForSuccess } from "@/actions/checkout";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) redirect("/");

  const order = await getOrderForSuccess(orderId);

  if (!order) redirect("/");

  return (
    <div className="container-tight section-padding">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <CheckCircle size={64} className="mx-auto text-green-500" />
          <h1 className="mt-6 font-heading text-3xl font-bold">Thank You for Your Order!</h1>
          <p className="mt-2 text-muted-foreground">
            Your order has been placed successfully.
          </p>
        </div>

        <div className="mt-8 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-lg font-bold">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p className="text-sm">
                {order.paymentMethod === "STRIPE" ? "Credit / Debit Card" : "Cash on Delivery"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
              <p className="text-sm">
                {order.paymentStatus === "PAID" ? (
                  <span className="text-green-600">Paid</span>
                ) : (
                  <span className="text-amber-600">Pending</span>
                )}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Shipping To</p>
              <p className="text-sm">
                {order.shippingName}, {order.shippingAddress1}
                {order.shippingAddress2 ? `, ${order.shippingAddress2}` : ""},{" "}
                {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <h3 className="mb-3 font-medium">Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-muted-foreground" />
                  <span>
                    {item.productName}
                    {item.variantName ? ` - ${item.variantName}` : ""}
                  </span>
                  <span className="text-muted-foreground">x{item.quantity}</span>
                </div>
                <span className="font-medium">{formatPrice(Number(item.totalPrice))}</span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(Number(order.subtotal))}</span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                <span>-{formatPrice(Number(order.discountAmount))}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {Number(order.shippingCost) === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatPrice(Number(order.shippingCost))
                )}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(Number(order.totalAmount))}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className={cn(
              buttonVariants({ size: "lg" }),
              "flex-1 rounded-none text-sm font-semibold uppercase tracking-wider"
            )}
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/account/orders"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "flex-1 rounded-none text-sm font-semibold uppercase tracking-wider"
            )}
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
