"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export async function login(values: { email: string; password: string }) {
  const validated = loginSchema.safeParse(values);
  if (!validated.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validated.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function register(values: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const validated = registerSchema.safeParse(values);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || "Invalid fields" };
  }

  const { name, email, password } = validated.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      emailVerified: new Date(),
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return { success: true };
}
