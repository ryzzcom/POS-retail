import { create } from "zustand";

export interface StoreBranchState {
  currentStore: unknown;
  currentBranch: unknown;
}

export const useStoreBranch = create<StoreBranchState>(() => ({
  currentStore: null,
  currentBranch: null,
}));
