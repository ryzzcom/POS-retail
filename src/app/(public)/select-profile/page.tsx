import type { Metadata } from "next";
import { SelectProfileView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Select Profile | POS Retail",
  description: "Select your staff profile and enter your 4-digit PIN to access your terminal or dashboard",
};

export default function SelectProfilePage() {
  return <SelectProfileView />;
}
