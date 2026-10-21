import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import type { Product } from '@/types/product'
import type { CartItem, CartSummary } from '@/types/cart'
import { analytics } from '@/services/analyticsService'
import { useToast } from './ToastContext'

const CART_STORAGE_KEY = 'harvest_hearth_cart_v1'
const FREE_SHIPPING_THRESHOLD = 999
const STANDARD_SHIPPING_FEE = 80

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const { success, info } = useToast()

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to persist cart items to localStorage', err)
    }
  }, [items])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), [])

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (product.stockQuantity !== null && product.stockQuantity <= 0) {
        info('Out of Stock', `${product.name} is currently harvested out.`)
        return
      }

      setItems(prevItems => {
        const existingIndex = prevItems.findIndex(i => i.product.id === product.id)
        if (existingIndex > -1) {
          const updated = [...prevItems]
          const existing = updated[existingIndex]
          const newQty = existing.quantity + quantity
          // Cap at available stock if stock quantity exists
          const cappedQty =
            product.stockQuantity !== null
              ? Math.min(newQty, product.stockQuantity)
              : Math.min(newQty, 99)

          updated[existingIndex] = {
            ...existing,
            quantity: cappedQty,
          }
          return updated
        }
        return [...prevItems, { product, quantity: Math.min(quantity, 99) }]
      })

      analytics.trackEvent('add_to_cart', {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
      })

      success('Added to Cart', `${quantity}x ${product.name} added to your basket.`)
    },
    [success, info]
  )

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(i => i.product.id !== productId)
      }
      return prevItems.map(item => {
        if (item.product.id === productId) {
          const maxStock = item.product.stockQuantity ?? 99
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          }
        }
        return item
      })
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems(prevItems => {
      const removed = prevItems.find(i => i.product.id === productId)
      if (removed) {
        analytics.trackEvent('remove_from_cart', {
          productId: removed.product.id,
          productName: removed.product.name,
        })
      }
      return prevItems.filter(i => i.product.id !== productId)
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const summary: CartSummary = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
    const discountTotal = items.reduce((sum, item) => {
      if (item.product.compareAtPrice && item.product.compareAtPrice > item.product.price) {
        return sum + (item.product.compareAtPrice - item.product.price) * item.quantity
      }
      return sum
    }, 0)

    const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
    const total = subtotal + shippingFee

    return {
      items,
      itemCount,
      subtotal,
      discountTotal,
      shippingFee,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      total,
    }
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
