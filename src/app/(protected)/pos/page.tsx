import { Suspense } from "react";
import { PosTerminalView } from "@/features/pos";

export default function StandalonePosPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-primary flex items-center justify-center text-dark-primary font-sans text-sm">
          Loading POS Terminal...
        </div>
      }
    >
      <PosTerminalView />
    </Suspense>
  );
}
