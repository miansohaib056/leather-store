import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/actions/categories";
import { getStorefrontProducts } from "@/lib/queries/products";
import { ProductCard } from "@/components/storefront/product/product-card";
import { ProductFilters } from "@/components/storefront/category/product-filters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.metaTitle || category.name,
    description: category.metaDescription || category.description || `Shop ${category.name}`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; minPrice?: string; maxPrice?: string; material?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Number(sp.page) || 1;
  const { products, total, pages } = await getStorefrontProducts({
    page,
    categorySlug: slug,
    sort: sp.sort,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    material: sp.material,
  });

  return (
    <div className="container-wide section-padding">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">{category.name}</h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">{total} products</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <ProductFilters />
        </aside>
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No products in this category yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    basePrice: Number(product.basePrice),
                    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
                    images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
                    avgRating: Number(product.avgRating),
                    reviewCount: product.reviewCount,
                    material: product.material,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
