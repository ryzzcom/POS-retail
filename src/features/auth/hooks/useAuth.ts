"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import type { UserContext, StoreContext, StaffProfile } from "../types/auth.types";
import { apiClient } from "@/lib/api-client";

export function useAuth() {
  const router = useRouter();
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<UserContext | null>(null);
  const [store, setStore] = React.useState<StoreContext | null>(null);
  const [activeProfile, setActiveProfile] = React.useState<StaffProfile | null>(null);
  const [activeRole, setActiveRole] = React.useState<"OWNER" | "CASHIER" | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const syncStateFromStorage = React.useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const storedToken = apiClient.getToken();
      setToken(storedToken);

      const storedStore = localStorage.getItem("active_store");
      if (storedStore) setStore(JSON.parse(storedStore));

      const storedProfile = localStorage.getItem("active_profile");
      if (storedProfile) setActiveProfile(JSON.parse(storedProfile));

      const storedRole = (localStorage.getItem("active_role") ||
        sessionStorage.getItem("active_role")) as "OWNER" | "CASHIER" | null;
      if (storedRole) setActiveRole(storedRole);
    } catch {
      // Storage parsing failed
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    syncStateFromStorage();
  }, [syncStateFromStorage]);

  const logout = React.useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      setStore(null);
      setActiveProfile(null);
      setActiveRole(null);
      router.push("/login");
    }
  }, [router]);

  return {
    isAuthenticated: Boolean(token),
    token,
    user,
    store,
    activeProfile,
    activeRole,
    isLoading,
    logout,
    syncStateFromStorage,
  };
}
