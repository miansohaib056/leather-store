import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Package, Truck } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Details" };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) notFound();

  return (
    <div>
      <Link
        href="/account/orders"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            statusColors[order.status] || "bg-gray-100 text-gray-800"
          )}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      {order.trackingNumber && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
          <Truck size={16} />
          <span>Tracking: <strong>{order.trackingNumber}</strong></span>
          {order.courierName && <span className="text-muted-foreground">via {order.courierName}</span>}
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-primary hover:underline"
            >
              Track Package
            </a>
          )}
        </div>
      )}

      <div className="mt-6 rounded-lg border">
        <div className="p-4 sm:p-6">
          <h3 className="mb-4 font-medium">Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {item.productName}
                      {item.variantName ? ` - ${item.variantName}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(Number(item.price))} x {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium">
                  {formatPrice(Number(item.totalPrice))}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-1 p-4 text-sm sm:p-6">
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
              {Number(order.shippingCost) === 0
                ? "Free"
                : formatPrice(Number(order.shippingCost))}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(Number(order.totalAmount))}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Shipping Address</h3>
          <p className="text-sm">
            {order.shippingName}<br />
            {order.shippingAddress1}<br />
            {order.shippingAddress2 && <>{order.shippingAddress2}<br /></>}
            {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}<br />
            {order.shippingPhone}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Payment</h3>
          <p className="text-sm">
            {order.paymentMethod === "STRIPE" ? "Credit / Debit Card" : "Cash on Delivery"}
          </p>
          <p className="mt-1 text-sm">
            Status:{" "}
            <span className={order.paymentStatus === "PAID" ? "text-green-600" : "text-amber-600"}>
              {order.paymentStatus}
            </span>
          </p>
        </div>
      </div>

      {order.statusHistory.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 font-medium">Order Timeline</h3>
          <div className="space-y-3">
            {order.statusHistory.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {entry.status.replace("_", " ")}
                  </p>
                  {entry.note && (
                    <p className="text-xs text-muted-foreground">{entry.note}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
