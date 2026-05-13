import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  products: {
    id: string;
    name: string;
    slug: string;
    basePrice: { toString(): string };
    compareAtPrice: { toString(): string } | null;
    material: string | null;
    avgRating: { toString(): string };
    reviewCount: number;
    images: { url: string; alt: string | null }[];
  }[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div>
      <h2 className="mb-8 font-heading text-2xl font-bold">You May Also Like</h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              basePrice: Number(product.basePrice.toString()),
              compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice.toString()) : null,
              images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
              avgRating: Number(product.avgRating.toString()),
              reviewCount: product.reviewCount,
              material: product.material,
            }}
          />
        ))}
      </div>
    </div>
  );
}
