import type { Category } from '@/types/category'

export interface ICategoryService {
  /**
   * Retrieves all product categories.
   */
  getCategories(signal?: AbortSignal): Promise<Category[]>;

  /**
   * Retrieves category by slug.
   */
  getCategoryBySlug(slug: string, signal?: AbortSignal): Promise<Category | null>;
}
