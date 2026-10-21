import { useState, useEffect } from 'react'
import type { Category } from '@/types/category'
import { categoryService } from '@/services'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function load() {
      try {
        const data = await categoryService.getCategories(controller.signal)
        if (isMounted) {
          setCategories(data)
          setIsLoading(false)
        }
      } catch (err: unknown) {
        if (isMounted && !(err instanceof DOMException && err.name === 'AbortError')) {
          setError('Failed to load categories')
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  return { categories, isLoading, error }
}
