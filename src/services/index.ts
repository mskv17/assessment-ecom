import type { IProductService } from './contracts/IProductService'
import type { ICategoryService } from './contracts/ICategoryService'
import { mockProductService } from './mock/mockProductService'
import { mockCategoryService } from './mock/mockCategoryService'
import { httpProductService } from './http/httpProductService'
import { httpCategoryService } from './http/httpCategoryService'

const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

/**
 * Single source of truth for product and category services.
 * Dynamically resolves to Mock or HTTP service based on VITE_USE_MOCK_DATA environment flag.
 */
export const productService: IProductService = useMockData
  ? mockProductService
  : httpProductService

export const categoryService: ICategoryService = useMockData
  ? mockCategoryService
  : httpCategoryService

export * from './contracts/IProductService'
export * from './contracts/ICategoryService'
export * from './analyticsService'
export * from './api/apiClient'
