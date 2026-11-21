"use client";

import * as React from "react";
import { settingsService } from "../services/settings.service";
import type {
  SettingsData,
  StoreProfileFormValues,
  StaffMember,
  StaffMemberFormValues,
  StaffStatus,
  ReceiptPrinterFormValues,
  SalesStockCreditFormValues,
} from "../types";

export function useSettings() {
  const [settings, setSettings] = React.useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSettings = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await settingsService.getAllSettings();
      setSettings(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load settings";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveStoreProfile = React.useCallback(
    async (values: Partial<StoreProfileFormValues>): Promise<boolean> => {
      try {
        setError(null);
        await settingsService.updateStoreProfile(values);
        await fetchSettings();
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to update store profile";
        setError(message);
        throw err;
      }
    },
    [fetchSettings]
  );

  const saveStaffMember = React.useCallback(
    async (values: StaffMemberFormValues, editingId?: string): Promise<StaffMember> => {
      try {
        setError(null);
        let result: StaffMember;
        if (editingId) {
          result = await settingsService.updateStaffMember(editingId, values);
        } else {
          result = await settingsService.createStaffMember(values);
        }
        await fetchSettings();
        return result;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to save staff member";
        setError(message);
        throw err;
      }
    },
    [fetchSettings]
  );

  const toggleStaffStatus = React.useCallback(
    async (id: string, currentStatus: StaffStatus): Promise<boolean> => {
      try {
        setError(null);
        const nextStatus: StaffStatus = currentStatus === "active" ? "suspended" : "active";
        await settingsService.updateStaffMember(id, { status: nextStatus });
        await fetchSettings();
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to update staff status";
        setError(message);
        throw err;
      }
    },
    [fetchSettings]
  );

  const removeStaffMember = React.useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);
        await settingsService.deleteStaffMember(id);
        await fetchSettings();
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to remove staff member";
        setError(message);
        throw err;
      }
    },
    [fetchSettings]
  );

  const saveReceiptSettings = React.useCallback(
    async (values: Partial<ReceiptPrinterFormValues>): Promise<boolean> => {
      try {
        setError(null);
        await settingsService.updateReceiptSettings(values);
        await fetchSettings();
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to save receipt settings";
        setError(message);
        throw err;
      }
    },
    [fetchSettings]
  );

  const saveSalesStockCredit = React.useCallback(
    async (values: Partial<SalesStockCreditFormValues>): Promise<boolean> => {
      try {
        setError(null);
        await settingsService.updateSalesStockCreditRules(values);
        await fetchSettings();
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to save sales & credit rules";
        setError(message);
        throw err;
      }
    },
    [fetchSettings]
  );

  return {
    settings,
    isLoading,
    error,
    refreshSettings: fetchSettings,
    saveStoreProfile,
    saveStaffMember,
    toggleStaffStatus,
    removeStaffMember,
    saveReceiptSettings,
    saveSalesStockCredit,
  };
}
