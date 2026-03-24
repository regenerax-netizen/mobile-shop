export function formatPrice(
  amount: number,
  locale = "de-DE",
  currency = "EUR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
