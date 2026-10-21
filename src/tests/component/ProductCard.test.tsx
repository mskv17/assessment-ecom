import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProductCard } from '@/components/shop/ProductCard'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import type { Product } from '@/types/product'

const sampleProduct: Product = {
  id: 'prod_test_01',
  name: 'Organic Wildflower Honey',
  slug: 'organic-wildflower-honey',
  categoryId: 'cat_honey',
  shortDescription: 'Fresh unheated mountain honey.',
  description: 'Pure wildflower honey harvested from pristine alpine meadows.',
  price: 550,
  compareAtPrice: 650,
  unitLabel: '500 g Jar',
  imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
  stockQuantity: 12,
  isFeatured: true,
  isActive: true,
  createdAt: '2026-03-01T00:00:00Z',
  dietaryTags: ['100% Raw'],
  origin: 'Himachal Pradesh',
}

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>{ui}</CartProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

describe('ProductCard Component', () => {
  it('renders product name, unit label, and price accurately', () => {
    renderWithProviders(<ProductCard product={sampleProduct} />)

    expect(screen.getByText('Organic Wildflower Honey')).toBeInTheDocument()
    expect(screen.getByText('500 g Jar')).toBeInTheDocument()
    expect(screen.getByText(/550/)).toBeInTheDocument()
    expect(screen.getByText(/650/)).toBeInTheDocument()
  })

  it('displays the calculated discount badge', () => {
    renderWithProviders(<ProductCard product={sampleProduct} />)

    // (650 - 550) / 650 = 15%
    expect(screen.getByText(/15% OFF/i)).toBeInTheDocument()
  })

  it('renders Add to Basket button', () => {
    renderWithProviders(<ProductCard product={sampleProduct} />)

    const addButton = screen.getByRole('button', { name: /Add Organic Wildflower Honey to basket/i })
    expect(addButton).toBeInTheDocument()
    expect(addButton).not.toBeDisabled()
  })

  it('disables Add button when product is out of stock', () => {
    const outOfStockProduct = { ...sampleProduct, stockQuantity: 0 }
    renderWithProviders(<ProductCard product={outOfStockProduct} />)

    const soldOutBadge = screen.getByText('Sold Out')
    expect(soldOutBadge).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /out of stock/i })
    expect(button).toBeDisabled()
  })
})
