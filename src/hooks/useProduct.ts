import { useState, useEffect, useCallback, useRef } from 'react'
import type { Product } from '@/types/product'
import { productService } from '@/services'
import { getUserFriendlyError, type UserFriendlyError } from '@/utils/errorHelpers'
import { analytics } from '@/services/analyticsService'

export function useProduct(slug?: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<UserFriendlyError | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchProduct = useCallback(async () => {
    if (!slug) {
      setIsLoading(false)
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const result = await productService.getProductBySlug(slug, controller.signal)
      setProduct(result)

      if (result) {
        analytics.trackEvent('view_item', {
          productId: result.id,
          productName: result.name,
          price: result.price,
          category: result.categoryId,
        })

        // Fetch related products
        const related = await productService.getRelatedProducts(result.id, 4, controller.signal)
        setRelatedProducts(related)
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }
      setError(getUserFriendlyError(err))
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchProduct()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchProduct])

  return {
    product,
    relatedProducts,
    isLoading,
    error,
    refetch: fetchProduct,
  }
}
