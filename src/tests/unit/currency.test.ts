import { describe, it, expect } from 'vitest'
import { formatCurrency, calculateDiscountPercent, calculateSavings } from '@/utils/currency'

describe('currency utilities', () => {
  describe('formatCurrency', () => {
    it('formats positive integers into INR currency format', () => {
      const formatted = formatCurrency(1450)
      // Check that it contains the rupee symbol and digits
      expect(formatted).toMatch(/₹\s?1,450/)
    })

    it('formats 0 into ₹0', () => {
      const formatted = formatCurrency(0)
      expect(formatted).toMatch(/₹\s?0/)
    })

    it('returns ₹0 for invalid or NaN inputs', () => {
      expect(formatCurrency(NaN)).toBe('₹0')
      expect(formatCurrency(Infinity)).toBe('₹0')
    })
  })

  describe('calculateDiscountPercent', () => {
    it('calculates the correct percentage discount', () => {
      // 1000 original, 750 current = 25% off
      expect(calculateDiscountPercent(750, 1000)).toBe(25)
    })

    it('returns null if compareAtPrice is missing or lower than price', () => {
      expect(calculateDiscountPercent(500, null)).toBeNull()
      expect(calculateDiscountPercent(500, 500)).toBeNull()
      expect(calculateDiscountPercent(500, 400)).toBeNull()
    })
  })

  describe('calculateSavings', () => {
    it('returns the exact absolute savings in INR', () => {
      expect(calculateSavings(750, 1000)).toBe(250)
    })

    it('returns 0 when there is no savings', () => {
      expect(calculateSavings(500, null)).toBe(0)
      expect(calculateSavings(500, 400)).toBe(0)
    })
  })
})
