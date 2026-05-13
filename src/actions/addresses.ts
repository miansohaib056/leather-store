"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { shippingSchema } from "@/lib/validations/checkout";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}

export async function getAddresses() {
  const user = await requireUser();
  return prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddress(data: {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}) {
  const user = await requireUser();
  const validated = shippingSchema.parse(data);

  const count = await prisma.address.count({ where: { userId: user.id } });

  return prisma.address.create({
    data: {
      userId: user.id,
      fullName: validated.fullName,
      phone: validated.phone,
      addressLine1: validated.addressLine1,
      addressLine2: validated.addressLine2,
      city: validated.city,
      state: validated.state,
      postalCode: validated.postalCode,
      country: validated.country,
      isDefault: count === 0,
    },
  });
}

export async function deleteAddress(id: string) {
  const user = await requireUser();
  await prisma.address.deleteMany({ where: { id, userId: user.id } });
}

export async function setDefaultAddress(id: string) {
  const user = await requireUser();

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    }),
    prisma.address.update({
      where: { id },
      data: { isDefault: true },
    }),
  ]);
}
