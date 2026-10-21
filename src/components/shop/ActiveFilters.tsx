import React from 'react'
import { X } from 'lucide-react'
import type { ProductFilters } from '@/types/product'
import type { Category } from '@/types/category'

export interface ActiveFiltersProps {
  filters: ProductFilters;
  categories: Category[];
  onRemoveFilter: (key: keyof ProductFilters) => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  categories,
  onRemoveFilter,
  onClearAll,
}) => {
  const activeCategory = categories.find(c => c.id === filters.categoryId)

  const hasAnyFilter = Boolean(
    filters.search ||
      filters.categoryId ||
      filters.inStockOnly ||
      filters.dietaryTag ||
      (filters.sortBy && filters.sortBy !== 'featured')
  )

  if (!hasAnyFilter) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 text-xs animate-in fade-in">
      <span className="font-semibold text-stone-500 mr-1">Active Filters:</span>

      {filters.search && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-stone-800 font-medium">
          Query: &ldquo;{filters.search}&rdquo;
          <button
            onClick={() => onRemoveFilter('search')}
            className="hover:text-stone-950 p-0.5 cursor-pointer"
            aria-label="Remove search filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {activeCategory && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] font-semibold border border-[#1B4332]/20">
          Category: {activeCategory.name}
          <button
            onClick={() => onRemoveFilter('categoryId')}
            className="hover:text-emerald-950 p-0.5 cursor-pointer"
            aria-label="Remove category filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {filters.inStockOnly && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
          In-Stock Only
          <button
            onClick={() => onRemoveFilter('inStockOnly')}
            className="hover:text-emerald-950 p-0.5 cursor-pointer"
            aria-label="Remove in-stock filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {filters.dietaryTag && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-medium">
          {filters.dietaryTag}
          <button
            onClick={() => onRemoveFilter('dietaryTag')}
            className="hover:text-amber-950 p-0.5 cursor-pointer"
            aria-label="Remove dietary filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      <button
        onClick={onClearAll}
        className="text-stone-500 hover:text-stone-800 underline font-semibold ml-1 cursor-pointer"
      >
        Clear all
      </button>
    </div>
  )
}
