// wa.me needs digits only (country code first, no "+" or spaces).
export function normalizeWhatsAppNumber(raw: string | undefined | null = ""): string {
  return String(raw ?? "").replace(/\D/g, "");
}

export function buildWhatsAppLink(
  number: string,
  productName?: string,
  productUrl?: string
): string {
  const text = productName
    ? `أهلاً، عايز أسأل عن: ${productName}${productUrl ? ` - ${productUrl}` : ""}`
    : "أهلاً، عايز أسأل عن منتجاتكم";
  return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(text)}`;
}
