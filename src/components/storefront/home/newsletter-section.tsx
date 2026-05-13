"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { subscribeNewsletter } from "@/actions/contact";
import { toast } from "sonner";

interface NewsletterFormProps {
  variant?: "default" | "compact";
}

export function NewsletterForm({ variant = "default" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const result = await subscribeNewsletter({ email, source: "homepage" });
      if (result.error) {
        toast.error(result.error);
        setStatus("error");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10"
        />
        <Button type="submit" className="w-full" size="sm" disabled={status === "loading"}>
          {status === "success" ? "Subscribed!" : "Subscribe"}
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md gap-2"
    >
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={cn(
          "h-12 flex-1 rounded-none border-white/20 bg-white/10 text-white placeholder:text-white/50",
          "focus-visible:ring-white/30"
        )}
      />
      <Button
        type="submit"
        size="lg"
        className="h-12 rounded-none bg-white px-6 text-[#1a1612] hover:bg-white/90"
        disabled={status === "loading"}
      >
        {status === "success" ? (
          "Subscribed!"
        ) : (
          <>
            Subscribe
            <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

export function NewsletterSection() {
  return (
    <section className="bg-[#1a1612] text-white">
      <div className="container-wide section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Join the RIQUE Family
          </h2>
          <p className="mt-4 text-white/60">
            Subscribe for exclusive offers, early access to new collections,
            and leather care tips. Get 10% off your first order.
          </p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
          <p className="mt-4 text-xs text-white/40">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
