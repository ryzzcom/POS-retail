import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POS Terminal | Noor Pret",
  description: "Point of Sale Cashier Terminal & Checkout",
};

export default function PosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
