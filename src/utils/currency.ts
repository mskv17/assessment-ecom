/**
 * Formats a numeric price into Indian Rupees (INR ₹) currency string.
 * Example: 1450 -> "₹1,450"
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
    return '₹0'
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculates discount percentage rounded to the nearest integer.
 * Returns null if no discount is present.
 */
export function calculateDiscountPercent(
  price: number,
  compareAtPrice: number | null
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null
  const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
  return discount > 0 ? discount : null
}

/**
 * Calculates absolute amount saved in INR.
 */
export function calculateSavings(
  price: number,
  compareAtPrice: number | null
): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return compareAtPrice - price
}
