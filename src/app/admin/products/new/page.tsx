import { getCategories } from "@/actions/categories";
import { ProductForm } from "@/components/admin/products/product-form";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Product</h1>
        <p className="text-sm text-muted-foreground">
          Add a new product to your store
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
