import { describe, it, expect } from 'vitest'
import { checkoutFormSchema, quantitySchema, searchInputSchema } from '@/utils/validators'

describe('validators', () => {
  describe('quantitySchema', () => {
    it('accepts valid integer quantities between 1 and 99', () => {
      expect(quantitySchema.safeParse(1).success).toBe(true)
      expect(quantitySchema.safeParse(15).success).toBe(true)
      expect(quantitySchema.safeParse(99).success).toBe(true)
    })

    it('rejects numbers below 1 or above 99', () => {
      expect(quantitySchema.safeParse(0).success).toBe(false)
      expect(quantitySchema.safeParse(-5).success).toBe(false)
      expect(quantitySchema.safeParse(100).success).toBe(false)
    })

    it('rejects floating point quantities', () => {
      expect(quantitySchema.safeParse(2.5).success).toBe(false)
    })
  })

  describe('searchInputSchema', () => {
    it('accepts normal search terms', () => {
      expect(searchInputSchema.safeParse('Himalayan Honey').success).toBe(true)
    })

    it('trims leading and trailing whitespace', () => {
      const parsed = searchInputSchema.parse('   cold pressed oil   ')
      expect(parsed).toBe('cold pressed oil')
    })
  })

  describe('checkoutFormSchema', () => {
    const validData = {
      fullName: 'Aarav Patel',
      email: 'aarav.patel@example.com',
      phone: '9876543210',
      addressLine: '42 Orchid Residency, MG Road',
      city: 'Bengaluru',
      postalCode: '560001',
    }

    it('validates a complete, correctly filled form', () => {
      expect(checkoutFormSchema.safeParse(validData).success).toBe(true)
    })

    it('rejects invalid email formats', () => {
      const invalid = { ...validData, email: 'not-an-email' }
      const result = checkoutFormSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects phone numbers that do not match 10-digit Indian mobile format', () => {
      const invalid = { ...validData, phone: '12345' }
      const result = checkoutFormSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects invalid 6-digit postal codes', () => {
      const invalid = { ...validData, postalCode: 'ABC12' }
      const result = checkoutFormSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })
})
