"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema, newsletterSchema } from "@/lib/validations/contact";

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const validated = contactSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  await prisma.contactSubmission.create({
    data: {
      name: validated.data.name,
      email: validated.data.email,
      phone: validated.data.phone,
      subject: validated.data.subject,
      message: validated.data.message,
    },
  });

  return { success: true };
}

export async function subscribeNewsletter(data: { email: string; source?: string }) {
  const validated = newsletterSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: validated.data.email },
  });

  if (existing) {
    if (existing.isActive) {
      return { error: "You're already subscribed!" };
    }
    await prisma.newsletterSubscriber.update({
      where: { id: existing.id },
      data: { isActive: true, unsubscribedAt: null },
    });
    return { success: true };
  }

  await prisma.newsletterSubscriber.create({
    data: {
      email: validated.data.email,
      source: validated.data.source || "website",
    },
  });

  return { success: true };
}
