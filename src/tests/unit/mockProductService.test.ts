import { describe, it, expect } from 'vitest'
import { MockProductService } from '@/services/mock/mockProductService'

describe('MockProductService', () => {
  // Use zero latency for instant test execution
  const service = new MockProductService(0)

  it('retrieves all active products', async () => {
    const products = await service.getProducts()
    expect(products.length).toBeGreaterThan(0)
    expect(products.every(p => p.isActive)).toBe(true)
  })

  it('finds product by slug accurately', async () => {
    const product = await service.getProductBySlug('a2-vedic-bilona-cow-ghee')
    expect(product).not.toBeNull()
    expect(product?.name).toBe('A2 Vedic Bilona Cow Ghee')
    expect(product?.price).toBe(1450)
  })

  it('returns null for nonexistent slugs', async () => {
    const product = await service.getProductBySlug('nonexistent-ghost-item')
    expect(product).toBeNull()
  })

  it('filters products by search query across name and description', async () => {
    const result = await service.searchProducts({ search: 'turmeric' })
    expect(result.items.length).toBeGreaterThan(0)
    expect(
      result.items.some(p => p.name.toLowerCase().includes('turmeric'))
    ).toBe(true)
  })

  it('filters products by categoryId', async () => {
    const result = await service.searchProducts({ categoryId: 'cat_honey' })
    expect(result.items.length).toBeGreaterThan(0)
    expect(result.items.every(p => p.categoryId === 'cat_honey')).toBe(true)
  })

  it('sorts products by price ascending and descending', async () => {
    const ascResult = await service.searchProducts({ sortBy: 'price-asc', pageSize: 100 })
    for (let i = 0; i < ascResult.items.length - 1; i++) {
      expect(ascResult.items[i].price).toBeLessThanOrEqual(ascResult.items[i + 1].price)
    }

    const descResult = await service.searchProducts({ sortBy: 'price-desc', pageSize: 100 })
    for (let i = 0; i < descResult.items.length - 1; i++) {
      expect(descResult.items[i].price).toBeGreaterThanOrEqual(descResult.items[i + 1].price)
    }
  })

  it('filters in-stock products only', async () => {
    const inStockResult = await service.searchProducts({ inStockOnly: true, pageSize: 100 })
    expect(
      inStockResult.items.every(p => p.stockQuantity === null || p.stockQuantity > 0)
    ).toBe(true)
  })
})
