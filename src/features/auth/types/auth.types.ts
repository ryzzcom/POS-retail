export interface StaffProfile {
  id: string;
  displayName: string;
  role: "OWNER" | "CASHIER";
  isPinSet: boolean;
  avatarUrl?: string;
  maxDiscountPct?: number;
  assignedCounterId?: string | null;
  assignedCounter?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface StoreContext {
  id: string;
  name: string;
  slug: string;
}

export interface UserContext {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: UserContext;
  store?: StoreContext;
  profiles?: StaffProfile[];
}

export interface UnlockProfileInput {
  profileId: string;
  pin: string;
}

export interface UnlockProfileResponse {
  success: boolean;
  sessionToken?: string;
  profile?: StaffProfile;
  landingPath?: string;
  error?: string;
}

export interface AuthActionResponse {
  success: boolean;
  message?: string;
  email?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: UserContext | null;
  store: StoreContext | null;
  activeProfile: StaffProfile | null;
  activeRole: "OWNER" | "CASHIER" | null;
}
