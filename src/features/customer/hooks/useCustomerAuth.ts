"use client";

import * as React from "react";
import {
  customerService,
  getCustomerToken,
  clearCustomerToken,
} from "../services/customer.service";
import type { CustomerUser, StoreMembership } from "../types/customer.types";

export function useCustomerAuth() {
  const [user, setUser] = React.useState<CustomerUser | null>(null);
  const [memberships, setMemberships] = React.useState<StoreMembership[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const refreshProfile = React.useCallback(async () => {
    const token = getCustomerToken();
    if (!token) {
      setUser(null);
      setMemberships([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await customerService.getMe();
      if (res?.user) {
        setUser(res.user);
        setMemberships(res.memberships || []);
      }
    } catch {
      // Token might be invalid or expired
      clearCustomerToken();
      setUser(null);
      setMemberships([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // Check cached user first for instant hydration
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("customer_jwt_user");
        if (cached) {
          setUser(JSON.parse(cached));
        }
      } catch {}
    }
    refreshProfile();
  }, [refreshProfile]);

  const loginWithOtp = async (phone: string, otp: string, fullName?: string) => {
    const res = await customerService.verifyOtp(phone, otp, fullName);
    if (res?.user) {
      setUser(res.user);
      await refreshProfile();
    }
    return res;
  };

  const logout = () => {
    clearCustomerToken();
    setUser(null);
    setMemberships([]);
  };

  const isAuthenticated = Boolean(user && getCustomerToken());

  return {
    user,
    memberships,
    isAuthenticated,
    isLoading,
    loginWithOtp,
    logout,
    refreshProfile,
  };
}
