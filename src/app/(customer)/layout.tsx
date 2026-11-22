import type { Metadata } from "next";
import { CustomerBottomNav } from "@/features/customer/components/CustomerBottomNav";

export const metadata: Metadata = {
  title: "Boutique Experience & AI Virtual Try-On",
  description: "Universal customer portal for luxury fashion boutiques, AI Try-On, and digital thermal receipts.",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page text-heading flex flex-col font-sans pb-16 sm:pb-6 antialiased selection:bg-accent/30 selection:text-primary">
      <main className="flex-1 w-full">{children}</main>
      <CustomerBottomNav />
    </div>
  );
}
