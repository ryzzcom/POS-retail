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

      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedStore = localStorage.getItem("active_store");
      if (storedStore) setStore(JSON.parse(storedStore));

      const storedProfile = localStorage.getItem("active_profile");
      if (storedProfile) setActiveProfile(JSON.parse(storedProfile));

      const storedRole = (localStorage.getItem("active_role") ||
        sessionStorage.getItem("active_role")) as "OWNER" | "CASHIER" | null;
      if (storedRole) setActiveRole(storedRole);

      // Hydrate via getMe if token exists but user or profile missing in cache
      if (storedToken && (!storedUser || !storedProfile)) {
        authService.getMe().then((meRes) => {
          if (meRes.user) {
            setUser(meRes.user);
            localStorage.setItem("user", JSON.stringify(meRes.user));
          }
          if (meRes.store) {
            setStore(meRes.store);
            localStorage.setItem("active_store", JSON.stringify(meRes.store));
          }
          if (meRes.profiles && meRes.profiles.length > 0 && !storedProfile) {
            const defaultProf: StaffProfile = {
              id: meRes.profiles[0].id,
              displayName: meRes.profiles[0].displayName,
              role: meRes.profiles[0].role,
              isPinSet: true,
              maxDiscountPct: meRes.profiles[0].maxDiscountPct,
              assignedCounterId: meRes.profiles[0].assignedCounterId || null,
            };
            setActiveProfile(defaultProf);
            localStorage.setItem("active_profile", JSON.stringify(defaultProf));
          }
        }).catch(() => {});
      }
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
