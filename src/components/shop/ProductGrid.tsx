import React from 'react'
import type { Product } from '@/types/product'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '@/components/common/Skeleton'

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  skeletonCount = 8,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
