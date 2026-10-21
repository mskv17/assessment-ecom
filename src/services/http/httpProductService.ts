import type { IProductService } from '../contracts/IProductService'
import type { Product, ProductFilters, PaginatedProducts } from '@/types/product'
import { apiClient } from '../api/apiClient'

export class HttpProductService implements IProductService {
  async getProducts(signal?: AbortSignal): Promise<Product[]> {
    return apiClient<Product[]>('/products', { signal })
  }

  async searchProducts(filters: ProductFilters, signal?: AbortSignal): Promise<PaginatedProducts> {
    const params = new URLSearchParams()
    if (filters.search) params.append('q', filters.search)
    if (filters.categoryId) params.append('category', filters.categoryId)
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.inStockOnly) params.append('inStock', 'true')
    if (filters.dietaryTag) params.append('tag', filters.dietaryTag)
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())

    const query = params.toString() ? `?${params.toString()}` : ''
    return apiClient<PaginatedProducts>(`/products/search${query}`, { signal })
  }

  async getProductBySlug(slug: string, signal?: AbortSignal): Promise<Product | null> {
    try {
      return await apiClient<Product>(`/products/slug/${slug}`, { signal })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 404) {
        return null
      }
      throw err
    }
  }

  async getProductById(id: string, signal?: AbortSignal): Promise<Product | null> {
    try {
      return await apiClient<Product>(`/products/${id}`, { signal })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 404) {
        return null
      }
      throw err
    }
  }

  async getRelatedProducts(productId: string, limit = 4, signal?: AbortSignal): Promise<Product[]> {
    return apiClient<Product[]>(`/products/${productId}/related?limit=${limit}`, { signal })
  }

  async getFeaturedProducts(limit = 6, signal?: AbortSignal): Promise<Product[]> {
    return apiClient<Product[]>(`/products/featured?limit=${limit}`, { signal })
  }
}

export const httpProductService = new HttpProductService()
