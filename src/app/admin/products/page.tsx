import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getProducts } from "@/actions/products";
import { AdminProductsTable } from "@/components/admin/products/products-table";
import { cn } from "@/lib/utils";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { products, total, pages } = await getProducts({
    page,
    search: params.search,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            {total} product{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className={cn(buttonVariants())}
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </Link>
      </div>

      <AdminProductsTable products={products} currentPage={page} totalPages={pages} />
    </div>
  );
}
