import { useState, useEffect, useCallback, useRef } from 'react'
import type { ProductFilters, PaginatedProducts } from '@/types/product'
import { productService } from '@/services'
import { getUserFriendlyError, type UserFriendlyError } from '@/utils/errorHelpers'

export function useProducts(filters: ProductFilters) {
  const [data, setData] = useState<PaginatedProducts>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<UserFriendlyError | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchProducts = useCallback(async () => {
    // Abort previous pending query
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const result = await productService.searchProducts(filters, controller.signal)
      setData(result)
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Ignored; query superseded
        return
      }
      setError(getUserFriendlyError(err))
    } finally {
      setIsLoading(false)
    }
  }, [
    filters.search,
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.inStockOnly,
    filters.dietaryTag,
    filters.sortBy,
    filters.page,
    filters.pageSize,
  ])

  useEffect(() => {
    fetchProducts()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchProducts])

  return {
    products: data.items,
    pagination: data,
    isLoading,
    error,
    refetch: fetchProducts,
  }
}
