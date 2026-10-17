import { create } from "zustand";

export interface CounterSessionState {
  currentCounter: unknown;
  activeSession: unknown;
  isLocked: boolean;
}

export const useCounterSession = create<CounterSessionState>(() => ({
  currentCounter: null,
  activeSession: null,
  isLocked: false,
}));
