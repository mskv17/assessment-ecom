import type { ICategoryService } from '../contracts/ICategoryService'
import type { Category } from '@/types/category'
import { MOCK_CATEGORIES } from '@/data/categories.mock'

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

export class MockCategoryService implements ICategoryService {
  private latencyMs: number

  constructor(latencyMs = 250) {
    const envLatency = import.meta.env.VITE_MOCK_NETWORK_LATENCY_MS
    this.latencyMs = envLatency ? parseInt(envLatency, 10) : latencyMs
  }

  async getCategories(signal?: AbortSignal): Promise<Category[]> {
    await delay(this.latencyMs, signal)
    return [...MOCK_CATEGORIES]
  }

  async getCategoryBySlug(slug: string, signal?: AbortSignal): Promise<Category | null> {
    await delay(this.latencyMs, signal)
    const category = MOCK_CATEGORIES.find(c => c.slug === slug)
    return category || null
  }
}

export const mockCategoryService = new MockCategoryService()
