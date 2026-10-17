export type Role = "owner" | "cashier";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
}

export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  currency: "PKR";
  address?: string;
  phone?: string;
}

export interface BranchInfo {
  id: string;
  storeId: string;
  name: string;
  code: string;
  isMainBranch: boolean;
}

export interface CounterInfo {
  id: string;
  branchId: string;
  storeId: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface CashierSession {
  cashierId: string;
  cashierName: string;
  counterId: string;
  counterName: string;
  shiftId?: string;
  openedAt?: string;
  isLocked: boolean;
}

