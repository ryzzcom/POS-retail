"use client";

import * as React from "react";
import { OwnerShell } from "@/components/layouts";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OwnerShell>{children}</OwnerShell>;
}

