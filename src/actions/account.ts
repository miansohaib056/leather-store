"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}

export async function updateProfile(data: { name: string; phone?: string }) {
  const user = await requireUser();

  if (!data.name || data.name.trim().length < 1) {
    return { error: "Name is required" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name.trim(),
      phone: data.phone?.trim() || null,
    },
  });

  return { success: true };
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { hashedPassword: true },
  });

  if (!user?.hashedPassword) {
    return { error: "Cannot change password for social login accounts" };
  }

  const isValid = await bcrypt.compare(data.currentPassword, user.hashedPassword);
  if (!isValid) {
    return { error: "Current password is incorrect" };
  }

  if (data.newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: { id: sessionUser.id },
    data: { hashedPassword },
  });

  return { success: true };
}
