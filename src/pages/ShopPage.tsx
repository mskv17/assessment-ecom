import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { useProducts } from '@/hooks/useProducts'
import { useDebounce } from '@/hooks/useDebounce'
import type { ProductFilters, SortOption } from '@/types/product'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { ProductFiltersBar } from '@/components/shop/ProductFilters'
import { ActiveFilters } from '@/components/shop/ActiveFilters'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/common/Button'
import { analytics } from '@/services/analyticsService'

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories } = useCategories()

  // Read URL search params
  const categoryFromUrl = searchParams.get('category') || undefined
  const queryFromUrl = searchParams.get('q') || ''
  const sortFromUrl = (searchParams.get('sort') as SortOption) || 'featured'

  const [searchInput, setSearchInput] = useState(queryFromUrl)
  const debouncedSearch = useDebounce(searchInput, 300)

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Construct filters
  const filters: ProductFilters = useMemo(
    () => ({
      search: debouncedSearch,
      categoryId: categoryFromUrl,
      sortBy: sortFromUrl,
      inStockOnly: searchParams.get('inStock') === 'true',
      dietaryTag: searchParams.get('tag') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: 12,
    }),
    [debouncedSearch, categoryFromUrl, sortFromUrl, searchParams]
  )

  const { products, pagination, isLoading, error, refetch } = useProducts(filters)

  // Sync debounced search to URL and track
  useEffect(() => {
    if (debouncedSearch !== queryFromUrl) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        if (debouncedSearch) {
          next.set('q', debouncedSearch)
        } else {
          next.delete('q')
        }
        next.set('page', '1')
        return next
      })

      if (debouncedSearch) {
        analytics.trackEvent('search', {
          query: debouncedSearch,
          resultsCount: products.length,
        })
      }
    }
  }, [debouncedSearch, queryFromUrl, setSearchParams, products.length])

  const handleFilterUpdate = (updated: Partial<ProductFilters>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (updated.categoryId !== undefined) {
        if (updated.categoryId) next.set('category', updated.categoryId)
        else next.delete('category')
      }
      if (updated.sortBy !== undefined) {
        if (updated.sortBy && updated.sortBy !== 'featured') next.set('sort', updated.sortBy)
        else next.delete('sort')
      }
      if (updated.inStockOnly !== undefined) {
        if (updated.inStockOnly) next.set('inStock', 'true')
        else next.delete('inStock')
      }
      if (updated.dietaryTag !== undefined) {
        if (updated.dietaryTag) next.set('tag', updated.dietaryTag)
        else next.delete('tag')
      }
      if (updated.page !== undefined) {
        next.set('page', updated.page.toString())
      } else {
        next.set('page', '1')
      }
      return next
    })

    // Track filter applied event
    if (updated.categoryId) {
      analytics.trackEvent('filter_applied', {
        filterType: 'category',
        value: updated.categoryId,
      })
    }
  }

  const handleResetFilters = () => {
    setSearchInput('')
    setSearchParams({})
  }

  const handleRemoveSingleFilter = (key: keyof ProductFilters) => {
    if (key === 'search') {
      setSearchInput('')
    }
    handleFilterUpdate({ [key]: undefined })
  }

  const currentCategoryName = categories.find(c => c.id === filters.categoryId)?.name

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
          {currentCategoryName ? currentCategoryName : 'All Pantry Harvest'}
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
          {currentCategoryName
            ? `Discover pure ${currentCategoryName.toLowerCase()} handcrafted sustainably across India.`
            : 'Explore our unadulterated cold-pressed oils, mountain honeys, heirloom grains, and single-origin spices.'}
        </p>
      </div>

      {/* Search & Mobile Filter Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by ingredient, aroma, or origin..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 p-0.5"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="outline"
            onClick={() => setIsMobileFiltersOpen(true)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            className="w-full justify-center"
          >
            Filters & Sorting
          </Button>
        </div>
      </div>

      {/* Active Filters Row */}
      <ActiveFilters
        filters={filters}
        categories={categories}
        onRemoveFilter={handleRemoveSingleFilter}
        onClearAll={handleResetFilters}
      />

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28">
          <ProductFiltersBar
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterUpdate}
            onResetFilters={handleResetFilters}
            totalResults={pagination.total}
          />
        </aside>

        {/* Products Grid Area */}
        <main className="lg:col-span-3">
          {error ? (
            <ErrorState
              title={error.title}
              message={error.message}
              canRetry={error.canRetry}
              onRetry={refetch}
            />
          ) : !isLoading && products.length === 0 ? (
            <EmptyState
              iconType="search"
              title="No Pantry Items Match"
              description="We could not find any organic food items matching your exact query or active filter settings."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <ProductGrid products={products} isLoading={isLoading} skeletonCount={6} />

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => handleFilterUpdate({ page: pagination.page - 1 })}
                  >
                    Previous
                  </Button>

                  <span className="text-xs font-semibold text-stone-600 px-3">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handleFilterUpdate({ page: pagination.page + 1 })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFiltersOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col">
              <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                <h3 className="font-bold text-stone-900 font-display">Filter Products</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <ProductFiltersBar
                  categories={categories}
                  filters={filters}
                  onFilterChange={updated => {
                    handleFilterUpdate(updated)
                    setIsMobileFiltersOpen(false)
                  }}
                  onResetFilters={() => {
                    handleResetFilters()
                    setIsMobileFiltersOpen(false)
                  }}
                  totalResults={pagination.total}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
