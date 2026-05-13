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
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10 rounded-full border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-amber-500/30"
        />
        <Button
          type="submit"
          className="h-10 w-full rounded-full bg-amber-600 text-white hover:bg-amber-700"
          size="sm"
          disabled={status === "loading"}
        >
          {status === "success" ? "Subscribed!" : "Subscribe"}
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-lg items-center rounded-full border border-white/15 bg-white/5 p-1.5 backdrop-blur"
    >
      <Input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={cn(
          "h-11 flex-1 rounded-full border-0 bg-transparent px-4 text-white shadow-none placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
        )}
      />
      <Button
        type="submit"
        size="lg"
        className="h-11 rounded-full bg-white px-6 text-stone-900 hover:bg-white/90"
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
    <section className="relative overflow-hidden bg-stone-950 text-white">
      <div className="absolute inset-0 grain opacity-50" />
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-700/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-900/20 blur-3xl" />

      <div className="container-wide relative section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            Join the Inner Circle
          </p>
          <h2 className="mt-4 font-heading text-3xl font-bold leading-tight md:text-5xl">
            10% off your <span className="text-gradient-warm">first order</span>
          </h2>
          <p className="mt-4 text-white/60">
            Subscribe for early access to new collections, exclusive offers,
            and leather care tips from our master craftsmen.
          </p>
          <div className="mt-10 flex justify-center">
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
