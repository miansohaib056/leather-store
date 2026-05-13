import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@riqueleather.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@riqueleather.com",
      hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`Admin user: ${admin.email}`);

  const customerPassword = await bcrypt.hash("customer123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Test Customer",
      email: "customer@example.com",
      hashedPassword: customerPassword,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  });
  console.log(`Customer user: ${customer.email}`);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "wallets" },
      update: {},
      create: {
        name: "Wallets",
        slug: "wallets",
        description: "Handcrafted leather wallets built to develop a beautiful patina over time.",
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "belts" },
      update: {},
      create: {
        name: "Belts",
        slug: "belts",
        description: "Full-grain leather belts that last a lifetime.",
        isActive: true,
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bags" },
      update: {},
      create: {
        name: "Bags",
        slug: "bags",
        description: "Premium leather bags for everyday carry and travel.",
        isActive: true,
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        description: "Leather card holders, key cases, and other essentials.",
        isActive: true,
        sortOrder: 4,
      },
    }),
  ]);
  console.log(`Created ${categories.length} categories`);

  const products = [
    {
      name: "Classic Bifold Wallet",
      slug: "classic-bifold-wallet",
      description: "<p>Our signature bifold wallet crafted from premium full-grain leather. Features 6 card slots, 2 note compartments, and an ID window. Develops a beautiful patina with use.</p>",
      shortDescription: "Premium full-grain leather bifold with 6 card slots",
      basePrice: 89.00,
      compareAtPrice: 120.00,
      material: "Full Grain Leather",
      careInstructions: "Wipe clean with a damp cloth. Apply leather conditioner every 3-6 months.",
      weight: 85,
      isFeatured: true,
      categorySlug: "wallets",
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1200&auto=format&fit=crop",
      ],
      variants: [
        { name: "Brown", color: "Brown", stock: 25, price: 89.00 },
        { name: "Black", color: "Black", stock: 18, price: 89.00 },
        { name: "Tan", color: "Tan", stock: 12, price: 95.00 },
      ],
    },
    {
      name: "Slim Card Holder",
      slug: "slim-card-holder",
      description: "<p>Minimalist card holder for the essentials. Holds up to 8 cards with a center slot for folded bills.</p>",
      shortDescription: "Minimalist leather card holder for everyday carry",
      basePrice: 49.00,
      material: "Full Grain Leather",
      careInstructions: "Wipe with dry cloth. Keep away from moisture.",
      weight: 35,
      isFeatured: true,
      categorySlug: "accessories",
      images: [
        "https://images.unsplash.com/photo-1612902456551-404b5b7c4040?q=80&w=1200&auto=format&fit=crop",
      ],
      variants: [
        { name: "Cognac", color: "Cognac", stock: 30, price: 49.00 },
        { name: "Black", color: "Black", stock: 22, price: 49.00 },
      ],
    },
    {
      name: "Heritage Belt",
      slug: "heritage-belt",
      description: "<p>A timeless leather belt with a solid brass buckle. Made from a single piece of vegetable-tanned leather. Gets better with age.</p>",
      shortDescription: "Vegetable-tanned leather belt with brass buckle",
      basePrice: 75.00,
      material: "Vegetable Tanned Leather",
      careInstructions: "Apply leather balm annually. Avoid prolonged water exposure.",
      weight: 180,
      isFeatured: true,
      categorySlug: "belts",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1200&auto=format&fit=crop",
      ],
      variants: [
        { name: "32", size: "32", stock: 15, price: 75.00 },
        { name: "34", size: "34", stock: 20, price: 75.00 },
        { name: "36", size: "36", stock: 18, price: 75.00 },
        { name: "38", size: "38", stock: 10, price: 75.00 },
      ],
    },
    {
      name: "Weekender Duffle",
      slug: "weekender-duffle",
      description: "<p>Full-grain leather duffle bag perfect for weekend getaways. Spacious main compartment with interior zip pocket, padded shoulder strap, and brass hardware throughout.</p>",
      shortDescription: "Premium leather duffle bag for weekend travel",
      basePrice: 349.00,
      compareAtPrice: 425.00,
      material: "Full Grain Leather",
      careInstructions: "Condition with leather cream. Store stuffed with tissue paper to maintain shape.",
      weight: 1800,
      isFeatured: true,
      categorySlug: "bags",
      images: [
        "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1564422170194-896b89110ef8?q=80&w=1200&auto=format&fit=crop",
      ],
      variants: [
        { name: "Brown", color: "Brown", stock: 8, price: 349.00 },
        { name: "Dark Brown", color: "Dark Brown", stock: 5, price: 349.00 },
      ],
    },
    {
      name: "Executive Messenger Bag",
      slug: "executive-messenger-bag",
      description: "<p>Professional messenger bag fits laptops up to 15 inches. Multiple organizational pockets, adjustable shoulder strap, and magnetic closure.</p>",
      shortDescription: "Leather messenger bag with laptop compartment",
      basePrice: 279.00,
      material: "Top Grain Leather",
      weight: 1200,
      isFeatured: true,
      categorySlug: "bags",
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1590739225497-56fdba0f5cdf?q=80&w=1200&auto=format&fit=crop",
      ],
      variants: [
        { name: "Dark Brown", color: "Dark Brown", stock: 12, price: 279.00 },
        { name: "Black", color: "Black", stock: 10, price: 279.00 },
      ],
    },
    {
      name: "Leather Key Organizer",
      slug: "leather-key-organizer",
      description: "<p>Compact key organizer keeps up to 6 keys neatly tucked away. No more jangling pockets.</p>",
      shortDescription: "Compact leather key holder for up to 6 keys",
      basePrice: 29.00,
      material: "Full Grain Leather",
      weight: 40,
      categorySlug: "accessories",
      images: [
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1200&auto=format&fit=crop",
      ],
      variants: [
        { name: "Brown", color: "Brown", stock: 40, price: 29.00 },
        { name: "Black", color: "Black", stock: 35, price: 29.00 },
      ],
    },
    {
      name: "Travel Passport Holder",
      slug: "travel-passport-holder",
      description: "<p>Slim passport holder with slots for cards and travel documents. Made from buttery soft full-grain leather. The perfect companion for international travel.</p>",
      shortDescription: "Leather passport holder with card slots",
      basePrice: 65.00,
      material: "Full Grain Leather",
      weight: 90,
      isFeatured: true,
      categorySlug: "accessories",
      images: [
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1200&auto=format&fit=crop",
      ],
      variants: [
        { name: "Saddle Brown", color: "Brown", stock: 18, price: 65.00 },
        { name: "Black", color: "Black", stock: 15, price: 65.00 },
      ],
    },
    {
      name: "Minimalist Tote Bag",
      slug: "minimalist-tote-bag",
      description: "<p>An everyday tote with timeless silhouette. Spacious interior, leather handles, and an interior zip pocket. Perfect for work or weekend errands.</p>",
      shortDescription: "Premium leather tote for everyday use",
      basePrice: 199.00,
      material: "Top Grain Leather",
      weight: 950,
      isFeatured: true,
      categorySlug: "bags",
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
      ],
      variants: [
        { name: "Cognac", color: "Cognac", stock: 14, price: 199.00 },
        { name: "Black", color: "Black", stock: 11, price: 199.00 },
      ],
    },
    {
      name: "Woven Leather Belt",
      slug: "woven-leather-belt",
      description: "<p>Hand-woven leather belt with antique brass buckle. A distinctive piece that pairs beautifully with casual and dress wear alike.</p>",
      shortDescription: "Hand-woven leather belt with brass buckle",
      basePrice: 95.00,
      compareAtPrice: 130.00,
      material: "Full Grain Leather",
      weight: 220,
      categorySlug: "belts",
      images: [
        "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1200&auto=format&fit=crop",
      ],
      variants: [
        { name: "32", size: "32", stock: 10, price: 95.00 },
        { name: "34", size: "34", stock: 15, price: 95.00 },
        { name: "36", size: "36", stock: 12, price: 95.00 },
      ],
    },
  ];

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categorySlug);
    const productImages = (p as { images?: string[] }).images ?? [];

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice || null,
        material: p.material,
        careInstructions: p.careInstructions || null,
        weight: p.weight || null,
        isFeatured: p.isFeatured || false,
        isActive: true,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice || null,
        material: p.material,
        careInstructions: p.careInstructions || null,
        weight: p.weight || null,
        isFeatured: p.isFeatured || false,
        isActive: true,
        categories: category
          ? { create: { categoryId: category.id } }
          : undefined,
        variants: {
          create: p.variants.map((v: Record<string, unknown>, i: number) => ({
            name: v.name as string,
            color: (v.color as string) || null,
            size: (v.size as string) || null,
            price: v.price as number,
            stock: v.stock as number,
            sortOrder: i,
          })),
        },
      },
    });

    if (productImages.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      await prisma.productImage.createMany({
        data: productImages.map((url, i) => ({
          productId: product.id,
          url,
          publicId: `seed_${product.slug}_${i}`,
          alt: product.name,
          sortOrder: i,
          isPrimary: i === 0,
        })),
      });
    }

    console.log(`Product: ${product.name} (${productImages.length} images)`);
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off your first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      maximumDiscount: 50,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FREESHIP" },
    update: {},
    create: {
      code: "FREESHIP",
      description: "Free shipping on any order",
      discountType: "FREE_SHIPPING",
      discountValue: 0,
      isActive: true,
    },
  });
  console.log("Created coupons: WELCOME10, FREESHIP");

  await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      title: "About RIQUE",
      slug: "about",
      content: "<h2>Our Story</h2><p>RIQUE was born from a passion for exceptional leather craftsmanship. For over 25 years, our family has been creating premium leather goods that stand the test of time.</p><h2>Our Craft</h2><p>Every piece is handcrafted using traditional techniques passed down through generations. We source only the finest full-grain and vegetable-tanned leathers.</p>",
      isPublished: true,
    },
  });

  await prisma.page.upsert({
    where: { slug: "shipping-policy" },
    update: {},
    create: {
      title: "Shipping Policy",
      slug: "shipping-policy",
      content: "<h2>Free Shipping</h2><p>Orders over $150 qualify for free standard shipping.</p><h2>Standard Shipping</h2><p>$15 flat rate for orders under $150. Delivery in 5-10 business days.</p><h2>International Shipping</h2><p>Contact us for international shipping quotes.</p>",
      isPublished: true,
    },
  });

  await prisma.page.upsert({
    where: { slug: "return-policy" },
    update: {},
    create: {
      title: "Return Policy",
      slug: "return-policy",
      content: "<h2>30-Day Returns</h2><p>Not satisfied? Return any unused item within 30 days for a full refund. Items must be in original condition.</p><h2>How to Return</h2><p>Email us at hello@riqueleather.com with your order number. We will provide a return shipping label.</p>",
      isPublished: true,
    },
  });
  console.log("Created static pages");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
