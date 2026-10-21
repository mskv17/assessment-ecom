import React, { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { formatCurrency } from '@/utils/currency'
import { checkoutFormSchema, type CheckoutFormData } from '@/utils/validators'
import { useCart } from '@/context/CartContext'
import { analytics } from '@/services/analyticsService'
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'

export interface DemoCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoCheckoutModal: React.FC<DemoCheckoutModalProps> = ({ isOpen, onClose }) => {
  const { summary, clearCart } = useCart()
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    addressLine: '',
    city: '',
    postalCode: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validationResult = checkoutFormSchema.safeParse(formData)

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {}
      validationResult.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof CheckoutFormData] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)

    // Simulate short network processing
    setTimeout(() => {
      const generatedOrderNo = `HH-${Math.floor(100000 + Math.random() * 900000)}`
      setOrderNumber(generatedOrderNo)
      setIsSubmitting(false)
      setIsSuccess(true)

      analytics.trackEvent('begin_checkout', {
        itemCount: summary.itemCount,
        subtotal: summary.subtotal,
      })

      clearCart()
    }, 600)
  }

  const handleResetModal = () => {
    setIsSuccess(false)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      addressLine: '',
      city: '',
      postalCode: '',
    })
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSuccess ? handleResetModal : onClose}
      title={isSuccess ? 'Harvest Order Confirmed' : 'Demo Checkout'}
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Demo Order Placed
          </span>

          <h4 className="text-2xl font-bold text-stone-900 mb-1 font-display">
            Thank you, {formData.fullName}!
          </h4>
          <p className="text-sm text-stone-600 mb-4">
            Order Reference: <span className="font-mono font-bold text-stone-800">{orderNumber}</span>
          </p>

          <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-stone-200/80 text-left mb-6 text-xs text-stone-600 space-y-2">
            <div className="flex justify-between border-b border-stone-200/50 pb-2">
              <span className="text-stone-500">Delivery Address:</span>
              <span className="font-medium text-stone-800 text-right">
                {formData.addressLine}, {formData.city} - {formData.postalCode}
              </span>
            </div>
            <div className="flex justify-between border-b border-stone-200/50 pb-2">
              <span className="text-stone-500">Contact:</span>
              <span className="font-medium text-stone-800">
                {formData.phone} | {formData.email}
              </span>
            </div>
            <div className="flex justify-between pt-1 font-semibold text-stone-900 text-sm">
              <span>Total Demo Amount:</span>
              <span className="text-emerald-800">{formatCurrency(summary.total)}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 mb-6 text-left">
            <p className="font-semibold mb-0.5">Note (Assessment Specification Compliance):</p>
            This was an entirely simulated checkout flow. No payment was charged, and no customer data was saved to a database.
          </div>

          <Button variant="primary" onClick={handleResetModal} fullWidth>
            Continue Browsing Pantry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honest Demo Alert (Spec Section 6) */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Honest Demonstration Store:</span> No live payment gateway or backend server is running in this phase. Test out the validation and user journey safely.
            </div>
          </div>

          {/* Cart Summary Header */}
          <div className="flex justify-between items-center py-2 px-3 bg-stone-50 rounded-xl border border-stone-200/80 text-sm">
            <span className="text-stone-600">{summary.itemCount} item(s) in basket</span>
            <span className="font-bold text-stone-900">{formatCurrency(summary.total)}</span>
          </div>

          {/* Form Fields with Inline Validation */}
          <Input
            label="Full Name"
            placeholder="e.g. Radhika Sharma"
            value={formData.fullName}
            onChange={e => handleInputChange('fullName', e.target.value)}
            error={errors.fullName}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="radhika@example.com"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="10-digit Phone"
              type="tel"
              placeholder="9876543210"
              maxLength={10}
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              required
            />
          </div>

          <Input
            label="Delivery Street Address"
            placeholder="Flat 4B, Greenwood Apartments, Heritage Lane"
            value={formData.addressLine}
            onChange={e => handleInputChange('addressLine', e.target.value)}
            error={errors.addressLine}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="City"
              placeholder="e.g. Bangalore"
              value={formData.city}
              onChange={e => handleInputChange('city', e.target.value)}
              error={errors.city}
              required
            />
            <Input
              label="PIN Code (6 digits)"
              placeholder="560001"
              maxLength={6}
              value={formData.postalCode}
              onChange={e => handleInputChange('postalCode', e.target.value)}
              error={errors.postalCode}
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              size="lg"
            >
              Place Simulated Order ({formatCurrency(summary.total)})
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
