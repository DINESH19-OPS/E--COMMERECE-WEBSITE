// Currency conversion utilities
// Exchange rate: 1 USD = 84 INR (as of June 2026)
const USD_TO_INR_RATE = 84;

export function convertToINR(usdPrice: number): number {
  return Math.round(usdPrice * USD_TO_INR_RATE);
}

export function formatINR(priceInINR: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInINR);
}

export function formatPrice(usdPrice: number): string {
  const inrPrice = convertToINR(usdPrice);
  return formatINR(inrPrice);
}
