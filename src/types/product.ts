/**
 * Product Data Model strictly adhering to Section 9 of the
 * E-Commerce Frontend Product Catalogue Specification.
 */
export interface Product {
  /** Stable unique identifier (e.g. "prod_01") */
  id: string;

  /** Required display name (e.g. "Raw Himalayan White Honey") */
  name: string;

  /** URL-friendly slug identifier for clean routing */
  slug: string;

  /** Foreign key pointing to a Category identifier */
  categoryId: string;

  /** Concise summary tailored for listing cards (<= 100 characters) */
  shortDescription: string;

  /** Rich detailed product story, origin, and culinary guidance */
  description: string;

  /** Non-negative price in Indian Rupees (INR ₹) */
  price: number;

  /** Optional original price to compute savings/discount percentage */
  compareAtPrice: number | null;

  /** Pack/unit measurement label (e.g. "500 g", "1 Litre", "Pack of 2") */
  unitLabel: string;

  /** Optimized WebP image URL with built-in fallback handling */
  imageUrl: string;

  /** Display availability count (0 = Out of stock, >0 = In stock, null = Available) */
  stockQuantity: number | null;

  /** Whether displayed prominently in Featured/Popular storefront blocks */
  isFeatured: boolean;

  /** Visibility flag; inactive products are filtered from the public catalog */
  isActive: boolean;

  /** ISO 8601 timestamp string for temporal sorting (newest first) */
  createdAt: string | null;

  // Supplementary food metadata
  /** Dietary and certification badges */
  dietaryTags?: string[];

  /** Geographic harvest source */
  origin?: string;

  /** Pure ingredient declaration */
  ingredients?: string;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'name-asc';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  dietaryTag?: string;
  sortBy?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
