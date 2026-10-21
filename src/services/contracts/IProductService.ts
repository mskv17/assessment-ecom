import type { Product, ProductFilters, PaginatedProducts } from '@/types/product'

export interface IProductService {
  /**
   * Retrieves all active products or filtered subset.
   */
  getProducts(signal?: AbortSignal): Promise<Product[]>;

  /**
   * Search, filter, sort and paginate products.
   */
  searchProducts(filters: ProductFilters, signal?: AbortSignal): Promise<PaginatedProducts>;

  /**
   * Find single product by its URL-friendly slug.
   */
  getProductBySlug(slug: string, signal?: AbortSignal): Promise<Product | null>;

  /**
   * Find single product by ID.
   */
  getProductById(id: string, signal?: AbortSignal): Promise<Product | null>;

  /**
   * Returns related products within same category, excluding the current product.
   */
  getRelatedProducts(productId: string, limit?: number, signal?: AbortSignal): Promise<Product[]>;

  /**
   * Returns featured products for the homepage showcase.
   */
  getFeaturedProducts(limit?: number, signal?: AbortSignal): Promise<Product[]>;
}
