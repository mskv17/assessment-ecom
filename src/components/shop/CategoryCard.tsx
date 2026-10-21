import React from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '@/types/category'
import { ArrowRight } from 'lucide-react'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'

export interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/shop?category=${category.id}`}
      className="group relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col bg-white"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        <ImageWithFallback
          src={category.imageUrl}
          alt={category.name}
          aspectRatioClass="aspect-4/3"
          className="group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
        
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
            {category.itemCount} Fresh Items
          </span>
          <h4 className="font-bold text-base sm:text-lg leading-tight font-display drop-shadow-xs">
            {category.name}
          </h4>
        </div>
      </div>

      <div className="p-3.5 flex items-center justify-between text-xs text-stone-600 bg-white">
        <span className="line-clamp-1">{category.description}</span>
        <span className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-[#1B4332] group-hover:text-white flex items-center justify-center shrink-0 ml-2 transition-colors">
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  )
}
