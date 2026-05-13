import { HeroSection } from "@/components/storefront/home/hero-section";
import { TrustBadges } from "@/components/storefront/home/trust-badges";
import { FeaturedCategories } from "@/components/storefront/home/featured-categories";
import { FeaturedProducts } from "@/components/storefront/home/featured-products";
import { BrandStory } from "@/components/storefront/home/brand-story";
import { Testimonials } from "@/components/storefront/home/testimonials";
import { NewsletterSection } from "@/components/storefront/home/newsletter-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <FeaturedCategories />
      <FeaturedProducts />
      <BrandStory />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
