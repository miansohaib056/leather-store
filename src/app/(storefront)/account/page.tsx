import Link from "next/link";
import { Package, MapPin, Star, Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, formatDate, cn } from "@/lib/utils";

export const metadata = { title: "My Account" };

export default async function AccountDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [orderCount, recentOrders, addressCount, reviewCount, wishlistCount] =
    await Promise.all([
      prisma.order.count({ where: { userId: session.user.id } }),
      prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { _count: { select: { items: true } } },
      }),
      prisma.address.count({ where: { userId: session.user.id } }),
      prisma.review.count({ where: { userId: session.user.id } }),
      prisma.wishlistItem.count({ where: { userId: session.user.id } }),
    ]);

  const stats = [
    { label: "Orders", value: orderCount, icon: Package, href: "/account/orders" },
    { label: "Addresses", value: addressCount, icon: MapPin, href: "/account/addresses" },
    { label: "Reviews", value: reviewCount, icon: Star, href: "/account/reviews" },
    { label: "Wishlist", value: wishlistCount, icon: Heart, href: "/wishlist" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-lg border p-4 transition-colors hover:bg-muted"
          >
            <Icon size={20} className="text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link
            href="/account/orders"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed p-8 text-center">
            <Package size={32} className="mx-auto text-muted-foreground/30" />
            <p className="mt-2 text-muted-foreground">No orders yet</p>
            <Link
              href="/products"
              className={cn(buttonVariants({ size: "sm" }), "mt-4 rounded-none")}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)} &middot; {order._count.items} item
                    {order._count.items !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(Number(order.totalAmount))}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {order.status.toLowerCase().replace("_", " ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
