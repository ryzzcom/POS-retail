import React, { Suspense } from "react";
import { CounterUnlockView } from "@/features/auth";

interface UnlockPageProps {
  params: Promise<{
    storeSlug: string;
    counterId: string;
  }>;
}

async function UnlockContent({ params }: UnlockPageProps) {
  const { storeSlug, counterId } = await params;
  return <CounterUnlockView storeSlug={storeSlug} counterId={counterId} />;
}

export default function UnlockPage(props: UnlockPageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-body">Loading counter terminal...</div>}>
      <UnlockContent {...props} />
    </Suspense>
  );
}
