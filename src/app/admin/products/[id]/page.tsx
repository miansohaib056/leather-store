import { notFound } from "next/navigation";
import { getProductById } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { ProductForm } from "@/components/admin/products/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    sku: product.sku,
    barcode: product.barcode,
    material: product.material,
    careInstructions: product.careInstructions,
    weight: product.weight ? Number(product.weight) : null,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    categoryIds: product.categories.map((c) => c.categoryId),
    tagIds: product.tags.map((t) => t.tagId),
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      color: v.color,
      size: v.size,
      price: v.price ? Number(v.price) : null,
      stock: v.stock,
      lowStockThreshold: v.lowStockThreshold,
      isActive: v.isActive,
      sortOrder: v.sortOrder,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm categories={categories} initialData={initialData} />
    </div>
  );
}
