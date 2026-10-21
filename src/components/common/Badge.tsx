import React from 'react'

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'accent' | 'neutral' | 'brand';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide shrink-0'

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 leading-none',
    md: 'text-xs px-2.5 py-1 leading-normal',
  }

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200/80',
    accent: 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold',
    neutral: 'bg-stone-100 text-stone-700 border border-stone-200',
    brand: 'bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20 font-semibold',
  }

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
