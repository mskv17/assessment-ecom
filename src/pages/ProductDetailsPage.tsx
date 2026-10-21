import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Check,
  MapPin,
} from 'lucide-react'
import { useProduct } from '@/hooks/useProduct'
import { formatCurrency, calculateDiscountPercent, calculateSavings } from '@/utils/currency'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { QuantitySelector } from '@/components/common/QuantitySelector'
import { ProductCard } from '@/components/shop/ProductCard'
import { StickyMobileAddToCart } from '@/components/pdp/StickyMobileAddToCart'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/common/Skeleton'
import { useCart } from '@/context/CartContext'

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { product, relatedProducts, isLoading, error, refetch } = useProduct(slug)
  const [quantity, setQuantity] = useState(1)
  const { addToCart, items } = useCart()

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="w-full aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton variant="text" className="w-32 h-5" />
            <Skeleton variant="text" className="w-3/4 h-8" />
            <Skeleton variant="text" className="w-40 h-7" />
            <Skeleton className="w-full h-24 rounded-2xl" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorState
          title={error?.title || 'Product Not Found'}
          message={
            error?.message ||
            'We could not find the artisanal food item you requested. It may have been unlisted or moved.'
          }
          canRetry={Boolean(error?.canRetry)}
          onRetry={refetch}
        />
        <div className="text-center mt-6">
          <Link to="/shop">
            <Button variant="outline">Browse All Pantry Harvest</Button>
          </Link>
        </div>
      </div>
    )
  }

  const discountPercent = calculateDiscountPercent(product.price, product.compareAtPrice)
  const savingsAmount = calculateSavings(product.price, product.compareAtPrice)

  const isOutOfStock = product.stockQuantity !== null && product.stockQuantity <= 0
  const isLowStock =
    product.stockQuantity !== null && product.stockQuantity > 0 && product.stockQuantity <= 5

  const existingInCart = items.find(i => i.product.id === product.id)
  const cartQuantity = existingInCart ? existingInCart.quantity : 0

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity)
    }
  }

  return (
    <div className="pb-24">
      {/* Sticky Mobile Add to Cart Bar */}
      <StickyMobileAddToCart product={product} triggerElementId="main-buy-box" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-stone-500 mb-6 overflow-x-auto whitespace-nowrap"
        >
          <Link to="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link to="/shop" className="hover:text-stone-900 transition-colors">
            Pantry Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="font-semibold text-stone-800 truncate">{product.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Product Imagery */}
          <div className="lg:col-span-6">
            <div className="sticky top-28 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-md bg-white">
                <ImageWithFallback
                  src={product.imageUrl}
                  alt={product.name}
                  aspectRatioClass="aspect-square"
                  isPriority={true}
                  className="w-full h-full object-cover"
                />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {discountPercent && (
                    <Badge variant="accent" size="md">
                      {discountPercent}% SAVINGS
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge variant="brand" size="md">
                      Harvest Select
                    </Badge>
                  )}
                </div>
              </div>

              {/* Dietary Tags Pill Bar */}
              {product.dietaryTags && product.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.dietaryTags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 border border-stone-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information, Pricing, & Conversion Actions */}
          <div className="lg:col-span-6 space-y-6" id="main-buy-box">
            {/* Origin & Unit Label */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
              <span className="font-semibold px-2.5 py-1 rounded-md bg-stone-200/70 text-stone-800">
                Pack Size: {product.unitLabel}
              </span>

              {product.origin && (
                <span className="flex items-center gap-1 text-stone-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  {product.origin}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display leading-tight">
              {product.name}
            </h1>

            {/* Price Presentation (Spec Section 6 CRO: price, compare-at, savings) */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#1B4332]">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-lg text-stone-400 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
                {savingsAmount > 0 && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Save {formatCurrency(savingsAmount)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                Inclusive of all taxes • Free shipping on orders over ₹999
              </p>
            </div>

            {/* Availability Indicator */}
            <div>
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  Currently Out of Stock
                </div>
              ) : isLowStock ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  Limited Harvest: Only {product.stockQuantity} units remaining
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  In Stock & Ready for Dispatch
                </div>
              )}
            </div>

            {/* Story & Description */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Artisanal Description
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Ingredients Declaration */}
            {product.ingredients && (
              <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-stone-900 uppercase tracking-wide">
                  Pure Ingredients:
                </span>
                <p className="text-stone-600">{product.ingredients}</p>
              </div>
            )}

            {/* Quantity Selector & Add To Basket Action Box */}
            <div className="pt-2 border-t border-stone-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {!isOutOfStock && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-stone-600">Quantity:</span>
                    <QuantitySelector
                      quantity={quantity}
                      onQuantityChange={setQuantity}
                      max={product.stockQuantity ?? 99}
                      size="lg"
                    />
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex-1 shadow-md hover:shadow-lg"
                  leftIcon={<ShoppingBag className="w-5 h-5" />}
                >
                  {isOutOfStock
                    ? 'Harvest Sold Out'
                    : cartQuantity > 0
                    ? `Add More to Basket (${cartQuantity} in Basket)`
                    : `Add to Basket • ${formatCurrency(product.price * quantity)}`}
                </Button>
              </div>

              {cartQuantity > 0 && (
                <p className="text-xs text-emerald-800 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>You have {cartQuantity} unit(s) of this item in your basket.</span>
                </p>
              )}
            </div>

            {/* Trust Assurance Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-200 text-xs text-stone-600">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-100/70">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Zero Pesticides</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-100/70">
                <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Tracked Courier</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-100/70">
                <RotateCcw className="w-4 h-4 text-stone-700 shrink-0" />
                <span>Purity Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-stone-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Complementary Taste
                </span>
                <h2 className="text-2xl font-bold text-stone-900 font-display mt-1">
                  You Might Also Savor
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-semibold text-[#1B4332] hover:underline"
              >
                Browse Full Catalog
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
