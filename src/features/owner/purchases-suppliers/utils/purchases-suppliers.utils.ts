import { formatPKR } from "@/lib/formatters";

/**
 * Calculate total quantity of items in a purchase order
 */
export function calculateTotalItems(
  items: Array<{ quantity: number }>
): number {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

/**
 * Format supplier balance with credit/debit indicator
 */
export function formatSupplierBalance(balance: number): string {
  if (balance <= 0) return "Settled";
  return formatPKR(balance);
}
