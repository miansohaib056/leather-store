import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics | Admin" };

export default async function AnalyticsPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentRevenue,
    previousRevenue,
    recentOrders,
    topProducts,
    recentCustomers,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID", createdAt: { gte: thirtyDaysAgo } },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { totalSold: "desc" },
      take: 5,
      include: { images: { take: 1 } },
    }),
    prisma.user.findMany({
      where: { role: "CUSTOMER", createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const revenue30d = Number(recentRevenue._sum.totalAmount ?? 0);
  const revenue60d = Number(previousRevenue._sum.totalAmount ?? 0);
  const revenueChange = revenue60d > 0 ? ((revenue30d - revenue60d) / revenue60d) * 100 : 0;

  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(Number(totalRevenue._sum.totalAmount ?? 0)),
      icon: DollarSign,
      sub: `${formatPrice(revenue30d)} last 30 days`,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      sub: `${recentRevenue._count} last 30 days`,
    },
    {
      title: "Customers",
      value: totalCustomers.toString(),
      icon: Users,
      sub: `${recentCustomers.length} new this month`,
    },
    {
      title: "Revenue Trend",
      value: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`,
      icon: TrendingUp,
      sub: "vs previous 30 days",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-sm text-muted-foreground">Store performance overview</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ title, value, icon: Icon, sub }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        {i + 1}.
                      </span>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(Number(product.basePrice))}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{product.totalSold} sold</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent orders</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.user.name || order.user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatPrice(Number(order.totalAmount))}
                      </p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {order.status.toLowerCase().replace("_", " ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
