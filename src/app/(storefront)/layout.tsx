import { AnnouncementBar } from "@/components/storefront/layout/announcement-bar";
import { Header } from "@/components/storefront/layout/header";
import { Footer } from "@/components/storefront/layout/footer";
import { MobileNav } from "@/components/storefront/layout/mobile-nav";
import { SearchDialog } from "@/components/storefront/layout/search-dialog";
import { CartSheet } from "@/components/storefront/cart/cart-sheet";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileNav />
      <SearchDialog />
      <CartSheet />
    </div>
  );
}
