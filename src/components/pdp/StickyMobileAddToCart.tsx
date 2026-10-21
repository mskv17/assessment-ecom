import React, { useState, useEffect } from 'react'
import type { Product } from '@/types/product'
import { formatCurrency } from '@/utils/currency'
import { Button } from '@/components/common/Button'
import { QuantitySelector } from '@/components/common/QuantitySelector'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { useCart } from '@/context/CartContext'
import { ShoppingBag } from 'lucide-react'

export interface StickyMobileAddToCartProps {
  product: Product;
  triggerElementId?: string;
}

export const StickyMobileAddToCart: React.FC<StickyMobileAddToCartProps> = ({
  product,
  triggerElementId = 'main-buy-box',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const isOutOfStock = product.stockQuantity !== null && product.stockQuantity <= 0

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById(triggerElementId)
      if (!el) return
      const rect = el.getBoundingClientRect()
      // If bottom of main buy box has scrolled past top of window
      setIsVisible(rect.bottom < 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [triggerElementId])

  if (!isVisible) return null

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 p-3 px-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-stone-200">
            <ImageWithFallback
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-stone-900 truncate font-display">
              {product.name}
            </p>
            <p className="text-xs font-bold text-[#1B4332]">
              {formatCurrency(product.price)}
              <span className="text-[10px] font-normal text-stone-500 ml-1">
                ({product.unitLabel})
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isOutOfStock && (
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              max={product.stockQuantity ?? 99}
              size="sm"
            />
          )}

          <Button
            variant="primary"
            size="sm"
            disabled={isOutOfStock}
            onClick={() => addToCart(product, quantity)}
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Basket'}
          </Button>
        </div>
      </div>
    </div>
  )
}
