import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "SEO | Admin" };

export default function SeoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">SEO Settings</h1>
      <p className="text-sm text-muted-foreground">
        Search engine optimization configuration
      </p>
      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <Search size={48} className="text-muted-foreground/30" />
        <p className="mt-4 font-medium">SEO is pre-configured</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>Sitemap: /sitemap.xml (auto-generated)</li>
          <li>Robots: /robots.txt (auto-generated)</li>
          <li>JSON-LD structured data on product pages</li>
          <li>OpenGraph and Twitter card metadata</li>
          <li>Per-page meta title and description fields</li>
        </ul>
      </div>
    </div>
  );
}
