"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { generateOrderNumber, absoluteUrl } from "@/lib/utils";
import { shippingSchema, paymentSchema } from "@/lib/validations/checkout";
import type { CartItem } from "@/types";

interface CheckoutInput {
  shipping: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    notes?: string;
    saveAddress?: boolean;
  };
  payment: {
    method: "STRIPE" | "COD";
    couponCode?: string;
  };
  items: CartItem[];
}

export async function createOrder(input: CheckoutInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to checkout." };
  }

  const shippingResult = shippingSchema.safeParse(input.shipping);
  if (!shippingResult.success) {
    return { error: shippingResult.error.issues[0].message };
  }

  const paymentResult = paymentSchema.safeParse(input.payment);
  if (!paymentResult.success) {
    return { error: paymentResult.error.issues[0].message };
  }

  const shipping = shippingResult.data;
  const payment = paymentResult.data;

  if (!input.items || input.items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { variants: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });

  const orderItems: {
    productId: string;
    variantId: string | null;
    productName: string;
    variantName: string | null;
    sku: string | null;
    price: number;
    quantity: number;
    totalPrice: number;
    imageUrl: string | null;
  }[] = [];

  let subtotal = 0;

  for (const cartItem of input.items) {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) {
      return { error: `Product "${cartItem.name}" is no longer available.` };
    }

    let price = Number(product.basePrice);
    let sku = product.sku;
    let variantName: string | null = null;

    if (cartItem.variantId) {
      const variant = product.variants.find((v) => v.id === cartItem.variantId);
      if (!variant || variant.stock < cartItem.quantity) {
        return { error: `"${cartItem.name}" variant is out of stock.` };
      }
      if (variant.price) price = Number(variant.price);
      if (variant.sku) sku = variant.sku;
      variantName = variant.name;
    }

    const totalPrice = price * cartItem.quantity;
    subtotal += totalPrice;

    orderItems.push({
      productId: product.id,
      variantId: cartItem.variantId,
      productName: product.name,
      variantName,
      sku,
      price,
      quantity: cartItem.quantity,
      totalPrice,
      imageUrl: product.images[0]?.url || null,
    });
  }

  let discountAmount = 0;
  let couponId: string | null = null;
  let couponCode: string | null = null;

  if (payment.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: payment.couponCode.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return { error: "Invalid coupon code." };
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { error: "This coupon has expired." };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { error: "This coupon has reached its usage limit." };
    }

    if (coupon.minimumPurchase && subtotal < Number(coupon.minimumPurchase)) {
      return { error: `Minimum purchase of $${Number(coupon.minimumPurchase).toFixed(2)} required for this coupon.` };
    }

    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = subtotal * (Number(coupon.discountValue) / 100);
      if (coupon.maximumDiscount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maximumDiscount));
      }
    } else if (coupon.discountType === "FIXED_AMOUNT") {
      discountAmount = Number(coupon.discountValue);
    }

    couponId = coupon.id;
    couponCode = coupon.code;
  }

  const shippingCost = subtotal >= 150 ? 0 : 15;
  const totalAmount = subtotal - discountAmount + shippingCost;
  const orderNumber = generateOrderNumber();

  if (shipping.saveAddress) {
    const existingAddresses = await prisma.address.count({
      where: { userId: session.user.id },
    });

    await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName: shipping.fullName,
        phone: shipping.phone,
        addressLine1: shipping.addressLine1,
        addressLine2: shipping.addressLine2,
        city: shipping.city,
        state: shipping.state,
        postalCode: shipping.postalCode,
        country: shipping.country,
        isDefault: existingAddresses === 0,
      },
    });
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      status: "PENDING",
      paymentMethod: payment.method,
      paymentStatus: payment.method === "COD" ? "PENDING" : "PENDING",
      subtotal,
      shippingCost,
      taxAmount: 0,
      discountAmount,
      totalAmount,
      couponId,
      couponCode,
      shippingName: shipping.fullName,
      shippingPhone: shipping.phone,
      shippingAddress1: shipping.addressLine1,
      shippingAddress2: shipping.addressLine2,
      shippingCity: shipping.city,
      shippingState: shipping.state,
      shippingPostalCode: shipping.postalCode,
      shippingCountry: shipping.country,
      notes: shipping.notes,
      items: {
        create: orderItems,
      },
      statusHistory: {
        create: {
          status: "PENDING",
          note: "Order placed",
        },
      },
    },
  });

  if (couponId) {
    await prisma.coupon.update({
      where: { id: couponId },
      data: { usageCount: { increment: 1 } },
    });
  }

  for (const item of orderItems) {
    if (item.variantId) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    await prisma.product.update({
      where: { id: item.productId },
      data: { totalSold: { increment: item.quantity } },
    });
  }

  if (payment.method === "STRIPE") {
    const stripeClient = getStripe();
    const stripeSession = await stripeClient.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email!,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productName + (item.variantName ? ` - ${item.variantName}` : ""),
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      ...(shippingCost > 0
        ? {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount" as const,
                  fixed_amount: { amount: Math.round(shippingCost * 100), currency: "usd" },
                  display_name: "Standard Shipping",
                  delivery_estimate: {
                    minimum: { unit: "business_day" as const, value: 5 },
                    maximum: { unit: "business_day" as const, value: 10 },
                  },
                },
              },
            ],
          }
        : {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount" as const,
                  fixed_amount: { amount: 0, currency: "usd" },
                  display_name: "Free Shipping",
                  delivery_estimate: {
                    minimum: { unit: "business_day" as const, value: 5 },
                    maximum: { unit: "business_day" as const, value: 10 },
                  },
                },
              },
            ],
          }),
      ...(discountAmount > 0
        ? {
            discounts: [
              {
                coupon: await stripeClient.coupons
                  .create({
                    amount_off: Math.round(discountAmount * 100),
                    currency: "usd",
                    duration: "once",
                    name: couponCode || "Discount",
                  })
                  .then((c) => c.id),
              },
            ],
          }
        : {}),
      success_url: absoluteUrl(`/checkout/success?orderId=${order.id}`),
      cancel_url: absoluteUrl("/cart"),
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return { url: stripeSession.url };
  }

  return { orderId: order.id };
}

export async function applyCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return { error: "Invalid coupon code." };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { error: "This coupon has expired." };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { error: "This coupon has reached its usage limit." };
  }

  if (coupon.minimumPurchase && subtotal < Number(coupon.minimumPurchase)) {
    return { error: `Minimum purchase of $${Number(coupon.minimumPurchase).toFixed(2)} required.` };
  }

  let discount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discount = subtotal * (Number(coupon.discountValue) / 100);
    if (coupon.maximumDiscount) {
      discount = Math.min(discount, Number(coupon.maximumDiscount));
    }
  } else if (coupon.discountType === "FIXED_AMOUNT") {
    discount = Math.min(Number(coupon.discountValue), subtotal);
  } else if (coupon.discountType === "FREE_SHIPPING") {
    discount = 0;
  }

  return {
    discount,
    code: coupon.code,
    type: coupon.discountType,
    description:
      coupon.discountType === "PERCENTAGE"
        ? `${Number(coupon.discountValue)}% off`
        : coupon.discountType === "FIXED_AMOUNT"
          ? `$${Number(coupon.discountValue).toFixed(2)} off`
          : "Free shipping",
  };
}

export async function getOrderForSuccess(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: {
      items: true,
    },
  });
}
