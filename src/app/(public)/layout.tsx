import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen w-full bg-page overflow-hidden">{children}</div>;
}
