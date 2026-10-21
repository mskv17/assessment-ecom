import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Skeleton } from '@/components/common/Skeleton'

const HomePage = lazy(() =>
  import('@/pages/HomePage').then(module => ({ default: module.HomePage }))
)
const ShopPage = lazy(() =>
  import('@/pages/ShopPage').then(module => ({ default: module.ShopPage }))
)
const ProductDetailsPage = lazy(() =>
  import('@/pages/ProductDetailsPage').then(module => ({ default: module.ProductDetailsPage }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage }))
)

const PageFallback: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
    <Skeleton className="w-1/3 h-10 rounded-xl" />
    <Skeleton className="w-full h-72 rounded-3xl" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Skeleton className="w-full h-48 rounded-2xl" />
      <Skeleton className="w-full h-48 rounded-2xl" />
      <Skeleton className="w-full h-48 rounded-2xl" />
    </div>
  </div>
)

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
