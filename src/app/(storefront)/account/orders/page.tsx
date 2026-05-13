import Link from "next/link";
import { Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Orders" };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { take: 3 },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <Package size={48} className="text-muted-foreground/30" />
        <h2 className="mt-4 text-lg font-semibold">No orders yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your order history will appear here
        </p>
        <Link
          href="/products"
          className={cn(buttonVariants({ size: "sm" }), "mt-6 rounded-none")}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Order History</h2>
      <div className="mt-4 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block rounded-lg border p-4 transition-colors hover:bg-muted sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    statusColors[order.status] || "bg-gray-100 text-gray-800"
                  )}
                >
                  {order.status.replace("_", " ")}
                </span>
                <span className="font-semibold">
                  {formatPrice(Number(order.totalAmount))}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Package size={14} />
              <span>
                {order._count.items} item{order._count.items !== 1 ? "s" : ""}
              </span>
              <span>&middot;</span>
              <span>
                {order.paymentMethod === "STRIPE" ? "Card" : "Cash on Delivery"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
