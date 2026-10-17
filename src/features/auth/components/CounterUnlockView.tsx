export interface CounterUnlockViewProps {
  storeSlug?: string;
  counterId?: string;
}

export function CounterUnlockView({ storeSlug = "store-1", counterId = "counter-1" }: CounterUnlockViewProps = {}) {
  return <div>Counter Unlock: {counterId} ({storeSlug})</div>;
}
