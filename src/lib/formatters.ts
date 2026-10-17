import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatPKR(
  amount: number,
  options?: { showDecimals?: boolean }
): string {
  const { showDecimals = false } = options || {};
  const formatted = new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  return "Rs. " + formatted;
}

export function formatDate(
  date: Date | string | number,
  pattern = "dd MMM yyyy"
): string {
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  return format(d, pattern);
}

export function formatDateTime(
  date: Date | string | number,
  pattern = "dd MMM yyyy, hh:mm a"
): string {
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  return format(d, pattern);
}

export function formatRelativeTime(date: Date | string | number): string {
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  return formatDistanceToNow(d, { addSuffix: true });
}
