import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/storefront/home/newsletter-section";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-stone-950 text-white">
      <div className="absolute inset-0 grain opacity-30" />
      <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-amber-700/10 blur-3xl" />

      <div className="container-wide relative pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <Logo variant="light" />
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              Premium handcrafted leather goods, made from the finest full-grain
              leather. Timeless style meets modern craftsmanship.
            </p>
            <div className="flex gap-2">
              <Link
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </Link>
              <Link
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Shop
              </h3>
              <ul className="mt-5 space-y-3">
                {footerNav.shop.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Company
              </h3>
              <ul className="mt-5 space-y-3">
                {footerNav.company.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Support
              </h3>
              <ul className="mt-5 space-y-3">
                {footerNav.support.slice(0, 3).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Stay Updated
            </h3>
            <p className="mt-5 text-sm text-white/60">
              Get 10% off your first order. No spam.
            </p>
            <div className="mt-4">
              <NewsletterForm variant="compact" />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerNav.support.slice(3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-white/40 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
