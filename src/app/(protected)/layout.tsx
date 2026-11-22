"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);

  React.useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setIsAuthorized(true);
  }, [router, pathname]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-3 select-none">
        <Loader2 className="size-8 text-dark-primary animate-spin" />
        <p className="font-sans text-xs text-dark-secondary tracking-wide">
          Verifying secure session...
        </p>
      </div>
    );
  }

  return <div className="min-h-screen">{children}</div>;
}
