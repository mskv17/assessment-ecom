import React from 'react'
import { PackageSearch, SearchX, ShoppingBag } from 'lucide-react'
import { Button } from './Button'

export interface EmptyStateProps {
  iconType?: 'search' | 'cart' | 'package';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconType = 'search',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'cart':
        return <ShoppingBag className="w-10 h-10 text-amber-700/70" />
      case 'package':
        return <PackageSearch className="w-10 h-10 text-emerald-800/70" />
      case 'search':
      default:
        return <SearchX className="w-10 h-10 text-stone-500" />
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-white/70 border border-stone-200/80 shadow-2xs max-w-lg mx-auto ${className}`}
    >
      <div className="w-20 h-20 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex items-center justify-center mb-4 shadow-inner">
        {renderIcon()}
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2 font-display">{title}</h3>
      <p className="text-sm text-stone-600 mb-6 max-w-sm leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
