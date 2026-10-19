/**
 * Format raw Pakistani phone number string into clean standard format (+92 3XX XXXXXXX)
 */
export function formatWhatsAppPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("92") && cleaned.length === 12) {
    return `+92 ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.startsWith("03") && cleaned.length === 11) {
    return `+92 ${cleaned.slice(1, 4)} ${cleaned.slice(4)}`;
  }
  return phone;
}

/**
 * Replace placeholders in template text with actual preview dictionary
 */
export function renderTemplatePreview(
  template: string,
  values: Record<string, string>
): string {
  let result = template;
  for (const [key, val] of Object.entries(values)) {
    result = result.replaceAll(`{{${key}}}`, val);
  }
  return result;
}
