"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getOrders({
  page = 1,
  limit = 20,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
} = {}) {
  const where: Record<string, unknown> = {};

  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { shippingName: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, pages: Math.ceil(total / limit) };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      items: {
        include: {
          product: { select: { slug: true } },
          variant: { select: { name: true } },
        },
      },
      statusHistory: { orderBy: { createdAt: "desc" } },
      coupon: true,
    },
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string
) {
  const session = await requireAdmin();

  const timestampField: Record<string, string> = {
    SHIPPED: "shippedAt",
    DELIVERED: "deliveredAt",
    CANCELLED: "cancelledAt",
  };

  const data: Record<string, unknown> = { status };
  if (timestampField[status]) {
    data[timestampField[status]] = new Date();
  }
  if (status === "CONFIRMED" || status === "DELIVERED") {
    data.paymentStatus = "PAID";
    data.paidAt = new Date();
  }

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data }),
    prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        note,
        changedBy: session.user.id,
      },
    }),
  ]);

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function updateTrackingInfo(
  orderId: string,
  trackingNumber: string,
  courierName?: string,
  trackingUrl?: string
) {
  await requireAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { trackingNumber, courierName, trackingUrl },
  });

  revalidatePath(`/admin/orders/${orderId}`);
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: { take: 3 },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
