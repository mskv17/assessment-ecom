import { z } from 'zod'

export const searchInputSchema = z.string().trim().max(100, 'Search query is too long')

export const quantitySchema = z
  .number({
    error: 'Quantity must be a number',
  })
  .int('Quantity must be an integer')
  .min(1, 'Quantity must be at least 1')
  .max(99, 'Maximum order quantity is 99 units')

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name (at least 2 characters)')
    .max(80, 'Full name cannot exceed 80 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  addressLine: z
    .string()
    .trim()
    .min(5, 'Please provide your full delivery street address'),
  city: z
    .string()
    .trim()
    .min(2, 'Please enter city'),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code'),
})

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>
