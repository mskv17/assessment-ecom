import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, Truck, Award, CheckCircle2, HeartHandshake } from 'lucide-react'
import { productService, categoryService } from '@/services'
import type { Product } from '@/types/product'
import type { Category } from '@/types/category'
import { ProductCard } from '@/components/shop/ProductCard'
import { CategoryCard } from '@/components/shop/CategoryCard'
import { ProductCardSkeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/common/Button'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function fetchData() {
      try {
        const [products, cats] = await Promise.all([
          productService.getFeaturedProducts(8, controller.signal),
          categoryService.getCategories(controller.signal),
        ])
        if (isMounted) {
          setFeaturedProducts(products)
          setCategories(cats)
          setIsLoading(false)
        }
      } catch (err: unknown) {
        if (isMounted && !(err instanceof DOMException && err.name === 'AbortError')) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F3EFEA] to-[#FAF8F5] pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Copy & Primary CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300 text-xs font-semibold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Spring 2026 Harvest Collection Now In</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1] font-display">
                Purity from Soil to Savor — <span className="text-[#1B4332]">100% Certified</span> Artisanal Foods.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Slow wood-pressed oils, raw cliff honey from the high Himalayas, stone-ground ancient grains, and single-origin Malabar spices. Crafted in pure micro-batches with zero chemical shortcuts.
              </p>

              {/* Conversion Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/shop">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto text-base shadow-md hover:shadow-lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Explore Fresh Pantry
                  </Button>
                </Link>
                <Link to="/shop?category=cat_oils">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base bg-white/80"
                  >
                    Cold-Pressed Oils & Ghee
                  </Button>
                </Link>
              </div>

              {/* Key Conversion Trust Points */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-stone-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  No chemical adulteration
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  Free delivery above ₹999
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  Glass & tin packaging
                </span>
              </div>
            </div>

            {/* Right Visual Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-4/5">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85"
                    alt="Artisanal organic harvest goods"
                    aspectRatioClass="aspect-4/5"
                    isPriority={true}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Micro-Badge */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/90 max-w-xs flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900 leading-tight">
                      Vedic Bilona Churning
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                      Pure cultured curd butter fat from A2 indigenous cows
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Lab-Certified Pure</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Zero synthetic pesticides, zero hexanes, and zero artificial colors.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Express Fresh Delivery</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Direct to doorstep with temperature-guarded protective shipping.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Fair Farm Sourcing</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Empowering smallholder regenerative family growers across 8 states.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Cold Heritage Milling</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Wooden kolhus and natural emery stones preserve natural nutrients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Curated Harvest
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              Explore by Pantry Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-[#1B4332] hover:text-[#143823] inline-flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Seasonal Specialties
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              Featured Pantry Selections
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-[#1B4332] hover:text-[#143823] inline-flex items-center gap-1 group"
          >
            <span>Browse Entire Catalogue</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Artisanal Heritage Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#1B4332] text-white p-8 sm:p-14 lg:p-16">
          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Our Earth Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display leading-tight">
              Food that restores soil vitality and nourishes generations.
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              We reject industrial high-heat refining and synthetic preservatives. Every bottle of oil is pressed slowly under 38°C; every jar of honey is bottled raw and unpasteurized straight from high-altitude bee boxes.
            </p>
            <div className="pt-2">
              <Link to="/shop">
                <Button variant="secondary" size="lg">
                  Shop the Pure Harvest
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
