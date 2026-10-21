import type { ICategoryService } from '../contracts/ICategoryService'
import type { Category } from '@/types/category'
import { apiClient } from '../api/apiClient'

export class HttpCategoryService implements ICategoryService {
  async getCategories(signal?: AbortSignal): Promise<Category[]> {
    return apiClient<Category[]>('/categories', { signal })
  }

  async getCategoryBySlug(slug: string, signal?: AbortSignal): Promise<Category | null> {
    try {
      return await apiClient<Category>(`/categories/slug/${slug}`, { signal })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 404) {
        return null
      }
      throw err
    }
  }
}

export const httpCategoryService = new HttpCategoryService()
