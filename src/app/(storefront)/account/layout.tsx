import Link from "next/link";
import { redirect } from "next/navigation";
import { User, Package, MapPin, Star, Settings } from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const accountNav = [
  { href: "/account", label: "Dashboard", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/reviews", label: "Reviews", icon: Star },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return (
    <div className="container-wide section-padding">
      <h1 className="font-heading text-3xl font-bold md:text-4xl">My Account</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome back, {session.user.name || session.user.email}
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {accountNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
