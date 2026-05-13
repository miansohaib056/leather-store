import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$0.00",
    change: "+0%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "0",
    change: "+0%",
    trend: "up" as const,
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    value: "0",
    change: "+0%",
    trend: "up" as const,
    icon: Users,
  },
  {
    title: "Products",
    value: "0",
    change: "Active",
    trend: "up" as const,
    icon: Package,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="mt-1 flex items-center text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp size={14} className="mr-1 text-green-600" />
                ) : (
                  <TrendingDown size={14} className="mr-1 text-red-600" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1 text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              <p className="text-sm">No orders yet. Orders will appear here.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              <p className="text-sm">
                Add products to see best sellers here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
