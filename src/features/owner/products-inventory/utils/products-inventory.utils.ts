/**
 * Calculate margin percentage: ((retail - cost) / retail) * 100
 */
export function calculateMarginPercent(retail: number, cost: number): number {
  if (retail <= 0) return 0;
  return Math.round(((retail - cost) / retail) * 100);
}

/**
 * Generate a valid 13-digit EAN-13 barcode with verified check digit
 */
export function generateEAN13Barcode(prefix: string = "896400"): string {
  const base = `${prefix}${Math.floor(100000 + Math.random() * 900000)}`.slice(0, 12);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return `${base}${checkDigit}`;
}
