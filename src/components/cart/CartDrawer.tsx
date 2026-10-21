import React, { useState } from 'react'
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Truck } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/currency'
import { Button } from '@/components/common/Button'
import { QuantitySelector } from '@/components/common/QuantitySelector'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { DemoCheckoutModal } from './DemoCheckoutModal'
import { Link } from 'react-router-dom'

export const CartDrawer: React.FC = () => {
  const { items, summary, isCartOpen, closeCart, updateQuantity, removeFromCart } = useCart()
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  if (!isCartOpen) return null

  const freeShippingProgress = Math.min(
    100,
    Math.round((summary.subtotal / summary.freeShippingThreshold) * 100)
  )

  const amountNeededForFreeShipping = Math.max(
    0,
    summary.freeShippingThreshold - summary.subtotal
  )

  const handleOpenCheckout = () => {
    setIsCheckoutModalOpen(true)
  }

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={closeCart}
          aria-hidden="true"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#1B4332]" />
                <h3 id="cart-title" className="text-lg font-bold text-stone-900 font-display">
                  Your Harvest Basket
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
                  {summary.itemCount}
                </span>
              </div>

              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
                aria-label="Close basket drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Notification */}
            <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-100/60 text-xs">
              <div className="flex items-center justify-between mb-1 text-stone-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  {amountNeededForFreeShipping === 0
                    ? '🎉 You unlocked FREE standard shipping!'
                    : `Add ${formatCurrency(amountNeededForFreeShipping)} more for FREE shipping`}
                </span>
                <span className="font-semibold text-stone-500">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-amber-200/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-stone-800 mb-1 font-display">
                    Your basket is empty
                  </h4>
                  <p className="text-xs text-stone-500 mb-6 max-w-xs leading-relaxed">
                    Explore our pure cold-pressed oils, wild honeys, and single-origin spices.
                  </p>
                  <Button
                    variant="primary"
                    onClick={closeCart}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Start Exploring
                  </Button>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={closeCart}
                      className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200/80 bg-stone-50"
                    >
                      <ImageWithFallback
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${product.slug}`}
                            onClick={closeCart}
                            className="font-semibold text-sm text-stone-900 hover:text-[#1B4332] line-clamp-1 transition-colors"
                          >
                            {product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 -mr-1 transition-colors cursor-pointer"
                            aria-label={`Remove ${product.name} from basket`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">{product.unitLabel}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <QuantitySelector
                          quantity={quantity}
                          max={product.stockQuantity ?? 99}
                          size="sm"
                          onQuantityChange={newQty => updateQuantity(product.id, newQty)}
                        />
                        <div className="text-right">
                          <span className="font-bold text-stone-900 text-sm">
                            {formatCurrency(product.price * quantity)}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="block text-[11px] text-stone-400 line-through">
                              {formatCurrency(product.compareAtPrice * quantity)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-stone-100 bg-[#FAF8F5]/80 space-y-3">
                {summary.discountTotal > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Total Savings
                    </span>
                    <span className="font-bold">-{formatCurrency(summary.discountTotal)}</span>
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">
                      {formatCurrency(summary.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-semibold text-stone-900">
                      {summary.shippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        formatCurrency(summary.shippingFee)
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-stone-200">
                  <div>
                    <span className="text-sm font-bold text-stone-900">Total</span>
                    <span className="block text-[11px] text-stone-500">Includes all taxes</span>
                  </div>
                  <span className="text-xl font-extrabold text-[#1B4332]">
                    {formatCurrency(summary.total)}
                  </span>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={handleOpenCheckout}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Demo Checkout
                </Button>

                <p className="text-[11px] text-center text-stone-400">
                  Frontend prototype • Zero payment required
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DemoCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  )
}
