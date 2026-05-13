import { HeroSection } from "@/components/storefront/home/hero-section";
import { TrustBadges } from "@/components/storefront/home/trust-badges";
import { FeaturedCategories } from "@/components/storefront/home/featured-categories";
import { FeaturedProducts } from "@/components/storefront/home/featured-products";
import { BrandStory } from "@/components/storefront/home/brand-story";
import { Testimonials } from "@/components/storefront/home/testimonials";
import { NewsletterSection } from "@/components/storefront/home/newsletter-section";
import { Marquee } from "@/components/storefront/home/marquee";
import { getFeaturedProducts } from "@/lib/queries/products";

export const revalidate = 60;

export default async function HomePage() {
  const featuredRaw = await getFeaturedProducts(8).catch(() => []);

  const products = featuredRaw.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    basePrice: Number(p.basePrice),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images.map((img) => ({ url: img.url, alt: img.alt })),
    avgRating: Number(p.avgRating),
    reviewCount: p.reviewCount,
    material: p.material,
  }));

  return (
    <>
      <HeroSection />
      <Marquee />
      <FeaturedCategories />
      <FeaturedProducts products={products.length > 0 ? products : undefined} />
      <BrandStory />
      <TrustBadges />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
