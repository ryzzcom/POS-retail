import type { Metadata } from "next";
import { SignupView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Create an Account | POS Retail",
  description: "Join POS Retail to manage your boutique, apparel store, and multi-tenant branches",
};

export default function SignupPage() {
  return <SignupView />;
}
