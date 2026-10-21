import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Check, ShoppingBag } from 'lucide-react'
import type { Product } from '@/types/product'
import { formatCurrency, calculateDiscountPercent } from '@/utils/currency'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { Badge } from '@/components/common/Badge'
import { useCart } from '@/context/CartContext'

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart()
  const discountPercent = calculateDiscountPercent(product.price, product.compareAtPrice)

  const isOutOfStock = product.stockQuantity !== null && product.stockQuantity <= 0
  const isLowStock =
    product.stockQuantity !== null && product.stockQuantity > 0 && product.stockQuantity <= 5

  const existingInCart = items.find(i => i.product.id === product.id)
  const cartQuantity = existingInCart ? existingInCart.quantity : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isOutOfStock) {
      addToCart(product, 1)
    }
  }

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/80 hover:border-emerald-700/30 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden bg-stone-100"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          aspectRatioClass="aspect-square"
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <Badge variant="accent" size="sm">
              {discountPercent}% OFF
            </Badge>
          )}

          {product.isFeatured && (
            <Badge variant="brand" size="sm">
              Harvest Special
            </Badge>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          {isOutOfStock ? (
            <Badge variant="danger" size="sm">
              Sold Out
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" size="sm">
              Only {product.stockQuantity} left
            </Badge>
          ) : null}
        </div>
      </Link>

      {/* Card Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unit Size & Dietary Tag */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-medium">{product.unitLabel}</span>
            {product.dietaryTags && product.dietaryTags[0] && (
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                {product.dietaryTags[0]}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-stone-900 group-hover:text-[#1B4332] text-sm sm:text-base leading-snug line-clamp-2 transition-colors mb-1.5 font-display">
            <Link to={`/product/${product.slug}`} className="focus:outline-none">
              {product.name}
            </Link>
          </h3>

          {/* Short Story */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Add to Cart Action Row */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-stone-900">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            {product.origin && (
              <span className="block text-[10px] text-stone-400 truncate max-w-[130px]">
                {product.origin}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={
              isOutOfStock
                ? `${product.name} is out of stock`
                : cartQuantity > 0
                ? `Add another ${product.name} to basket. Currently ${cartQuantity} in basket`
                : `Add ${product.name} to basket`
            }
            className={`relative min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1B4332] ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                : cartQuantity > 0
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-[#1B4332] text-white hover:bg-[#143823] active:scale-95'
            }`}
          >
            {cartQuantity > 0 ? (
              <span className="flex items-center gap-1 px-3 text-xs font-semibold">
                <Check className="w-4 h-4" />
                <span>{cartQuantity}</span>
              </span>
            ) : isOutOfStock ? (
              <span className="text-xs font-medium px-2">Sold</span>
            ) : (
              <span className="flex items-center gap-1.5 px-3.5 text-xs font-semibold">
                <Plus className="w-4 h-4" />
                <ShoppingBag className="w-3.5 h-3.5 hidden sm:inline" />
                <span>Add</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
