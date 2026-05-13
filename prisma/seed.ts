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
      categorySlug: "bags",
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
      variants: [
        { name: "Brown", color: "Brown", stock: 40, price: 29.00 },
        { name: "Black", color: "Black", stock: 35, price: 29.00 },
      ],
    },
  ];

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categorySlug);
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
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
    console.log(`Product: ${product.name}`);
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
