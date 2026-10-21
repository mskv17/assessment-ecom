import React from 'react'

export interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const variantStyles = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 my-1',
  }

  const inlineStyles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div
      className={`animate-shimmer bg-stone-200/80 ${variantStyles[variant]} ${className}`}
      style={inlineStyles}
      aria-hidden="true"
    />
  )
}

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-200/80 flex flex-col gap-3 shadow-xs">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton variant="text" className="w-20 h-4" />
        <Skeleton variant="text" className="w-16 h-4" />
      </div>
      <Skeleton variant="text" className="w-4/5 h-5" />
      <Skeleton variant="text" className="w-full h-3" />
      <div className="mt-2 flex items-center justify-between pt-2 border-t border-stone-100">
        <Skeleton variant="text" className="w-24 h-6" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  )
}
