import { getStorefrontProducts } from "@/lib/queries/products";
import { ProductCard } from "@/components/storefront/product/product-card";
import { ProductFilters } from "@/components/storefront/category/product-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete collection of premium handcrafted leather goods.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; minPrice?: string; maxPrice?: string; material?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { products, total, pages } = await getStorefrontProducts({
    page,
    sort: params.sort,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    material: params.material,
    search: params.search,
  });

  return (
    <div className="container-wide section-padding">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">
          {params.search ? `Search: "${params.search}"` : "All Products"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {total} product{total !== 1 ? "s" : ""} {params.search ? "found" : ""}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <ProductFilters />
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <>
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

              {pages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`?page=${p}&sort=${params.sort || ""}`}
                      className={`rounded-lg px-3 py-1.5 text-sm ${
                        p === page ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
