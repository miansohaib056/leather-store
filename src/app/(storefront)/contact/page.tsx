"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, MapPin, Loader2, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { submitContactForm } from "@/actions/contact";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactInput) => {
    startTransition(async () => {
      try {
        const result = await submitContactForm(data);
        if (result.error) {
          toast.error(result.error);
        } else {
          setSubmitted(true);
        }
      } catch {
        toast.error("Failed to send message");
      }
    });
  };

  return (
    <div className="container-wide section-padding">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold md:text-4xl">Get in Touch</h1>
          <p className="mt-2 text-muted-foreground">
            Have a question or need help? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail size={20} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">hello@riqueleather.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">+1 (555) 000-0000</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  RIQUE Leather Workshop<br />
                  Lahore, Pakistan
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-lg border py-16 text-center">
                <CheckCircle size={48} className="text-green-500" />
                <h2 className="mt-4 text-lg font-semibold">Message Sent!</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We&apos;ll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} className="mt-1" />
                    {errors.name && (
                      <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} className="mt-1" />
                    {errors.email && (
                      <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...register("subject")} className="mt-1" />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" {...register("message")} className="mt-1" rows={6} />
                  {errors.message && (
                    <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full rounded-none sm:w-auto" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
