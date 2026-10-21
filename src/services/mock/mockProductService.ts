import type { IProductService } from '../contracts/IProductService'
import type { Product, ProductFilters, PaginatedProducts } from '@/types/product'
import { MOCK_PRODUCTS } from '@/data/products.mock'

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    const timer = setTimeout(() => {
      resolve()
    }, ms)

    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

export class MockProductService implements IProductService {
  private latencyMs: number

  constructor(latencyMs = 300) {
    const envLatency = import.meta.env.VITE_MOCK_NETWORK_LATENCY_MS
    this.latencyMs = envLatency ? parseInt(envLatency, 10) : latencyMs
  }

  async getProducts(signal?: AbortSignal): Promise<Product[]> {
    await delay(this.latencyMs, signal)
    return MOCK_PRODUCTS.filter(p => p.isActive)
  }

  async searchProducts(
    filters: ProductFilters,
    signal?: AbortSignal
  ): Promise<PaginatedProducts> {
    await delay(this.latencyMs, signal)

    let filtered = MOCK_PRODUCTS.filter(p => p.isActive)

    // Text search on name, shortDescription, description, origin, ingredients
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.origin && p.origin.toLowerCase().includes(q)) ||
          (p.ingredients && p.ingredients.toLowerCase().includes(q)) ||
          (p.dietaryTags && p.dietaryTags.some(tag => tag.toLowerCase().includes(q)))
      )
    }

    // Category filter
    if (filters.categoryId) {
      filtered = filtered.filter(p => p.categoryId === filters.categoryId)
    }

    // Min price
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= (filters.minPrice ?? 0))
    }

    // Max price
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= (filters.maxPrice ?? Infinity))
    }

    // In-stock only filter
    if (filters.inStockOnly) {
      filtered = filtered.filter(p => p.stockQuantity === null || p.stockQuantity > 0)
    }

    // Dietary tag filter
    if (filters.dietaryTag) {
      filtered = filtered.filter(
        p => p.dietaryTags && p.dietaryTags.includes(filters.dietaryTag!)
      )
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })
        break
      case 'featured':
      default:
        // Featured items first, then ID
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return 0
        })
        break
    }

    const page = filters.page && filters.page > 0 ? filters.page : 1
    const pageSize = filters.pageSize && filters.pageSize > 0 ? filters.pageSize : 12
    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize) || 1
    const startIndex = (page - 1) * pageSize
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize)

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    }
  }

  async getProductBySlug(slug: string, signal?: AbortSignal): Promise<Product | null> {
    await delay(this.latencyMs, signal)
    const product = MOCK_PRODUCTS.find(p => p.slug === slug && p.isActive)
    return product || null
  }

  async getProductById(id: string, signal?: AbortSignal): Promise<Product | null> {
    await delay(this.latencyMs, signal)
    const product = MOCK_PRODUCTS.find(p => p.id === id && p.isActive)
    return product || null
  }

  async getRelatedProducts(
    productId: string,
    limit = 4,
    signal?: AbortSignal
  ): Promise<Product[]> {
    await delay(this.latencyMs, signal)
    const current = MOCK_PRODUCTS.find(p => p.id === productId)
    if (!current) return []

    // Match same category first, excluding current product
    let related = MOCK_PRODUCTS.filter(
      p => p.categoryId === current.categoryId && p.id !== productId && p.isActive
    )

    // If not enough in category, supplement with featured items
    if (related.length < limit) {
      const others = MOCK_PRODUCTS.filter(
        p => p.id !== productId && p.isActive && !related.some(r => r.id === p.id)
      )
      related = [...related, ...others]
    }

    return related.slice(0, limit)
  }

  async getFeaturedProducts(limit = 6, signal?: AbortSignal): Promise<Product[]> {
    await delay(this.latencyMs, signal)
    return MOCK_PRODUCTS.filter(p => p.isActive && p.isFeatured).slice(0, limit)
  }
}

export const mockProductService = new MockProductService()
