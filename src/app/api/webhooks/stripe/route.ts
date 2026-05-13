import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: {
            status: "CONFIRMED",
            paymentStatus: "PAID",
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id,
            paidAt: new Date(),
          },
        }),
        prisma.orderStatusHistory.create({
          data: {
            orderId,
            status: "CONFIRMED",
            note: "Payment confirmed via Stripe",
          },
        }),
      ]);
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (order && order.paymentStatus === "PENDING") {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: {
              status: "CANCELLED",
              paymentStatus: "FAILED",
              cancelledAt: new Date(),
            },
          }),
          prisma.orderStatusHistory.create({
            data: {
              orderId,
              status: "CANCELLED",
              note: "Stripe checkout session expired",
            },
          }),
        ]);

        for (const item of order.items) {
          if (item.variantId) {
            await prisma.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
          await prisma.product.update({
            where: { id: item.productId },
            data: { totalSold: { decrement: item.quantity } },
          });
        }

        if (order.couponId) {
          await prisma.coupon.update({
            where: { id: order.couponId },
            data: { usageCount: { decrement: 1 } },
          });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
