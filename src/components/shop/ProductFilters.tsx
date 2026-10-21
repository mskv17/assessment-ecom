import React from 'react'
import type { Category } from '@/types/category'
import type { ProductFilters, SortOption } from '@/types/product'
import { Filter, RotateCcw, Check } from 'lucide-react'

export interface ProductFiltersProps {
  categories: Category[];
  filters: ProductFilters;
  onFilterChange: (newFilters: Partial<ProductFilters>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const DIETARY_OPTIONS = [
  'Certified Organic',
  'Raw Vegan',
  'Gluten-Free',
  'Cold-Pressed',
  'A2 Certified',
  'Single-Origin',
]

export const ProductFiltersBar: React.FC<ProductFiltersProps> = ({
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm font-display">
          <Filter className="w-4 h-4 text-[#1B4332]" />
          <span>Refine Pantry</span>
          <span className="text-xs font-normal text-stone-400">({totalResults} items)</span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
          Categories
        </h4>
        <div className="flex flex-col gap-1.5 text-sm">
          <button
            type="button"
            onClick={() => onFilterChange({ categoryId: undefined, page: 1 })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
              !filters.categoryId
                ? 'bg-[#1B4332] text-white font-semibold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>All Pantry Goods</span>
          </button>

          {categories.map(cat => {
            const isSelected = filters.categoryId === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange({ categoryId: cat.id, page: 1 })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B4332] text-white font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-emerald-900 text-emerald-100' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* In-Stock Only Toggle */}
      <div className="pt-3 border-t border-stone-100">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-sm font-medium text-stone-800">In-Stock Only</span>
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={e => onFilterChange({ inStockOnly: e.target.checked, page: 1 })}
            className="w-4 h-4 text-[#1B4332] rounded border-stone-300 focus:ring-[#1B4332]"
          />
        </label>
      </div>

      {/* Dietary Tags Filter */}
      <div className="pt-3 border-t border-stone-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
          Dietary & Specialty
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {DIETARY_OPTIONS.map(tag => {
            const isSelected = filters.dietaryTag === tag
            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  onFilterChange({
                    dietaryTag: isSelected ? undefined : tag,
                    page: 1,
                  })
                }
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-emerald-700" />}
                <span>{tag}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sort Option Control */}
      <div className="pt-3 border-t border-stone-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Sort Catalog By
        </h4>
        <select
          value={filters.sortBy || 'featured'}
          onChange={e => onFilterChange({ sortBy: e.target.value as SortOption, page: 1 })}
          className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
        >
          <option value="featured">Featured Curations</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Recently Harvested</option>
          <option value="name-asc">Alphabetical (A - Z)</option>
        </select>
      </div>
    </div>
  )
}
