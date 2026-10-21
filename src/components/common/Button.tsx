import React from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled = false,
      className = '',
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]'

    const sizeStyles = {
      sm: 'text-xs px-3 py-2 min-h-[36px] gap-1.5',
      md: 'text-sm px-4 py-2.5 min-h-[44px] gap-2',
      lg: 'text-base px-6 py-3.5 min-h-[50px] gap-2.5',
    }

    const variantStyles = {
      primary:
        'bg-[#1B4332] text-white hover:bg-[#143823] focus:ring-[#1B4332] shadow-sm hover:shadow active:bg-[#0F281E]',
      secondary:
        'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 shadow-sm',
      outline:
        'border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 hover:border-stone-400 focus:ring-stone-400',
      ghost:
        'bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-900 focus:ring-stone-300',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
    }

    const widthStyle = fullWidth ? 'w-full' : ''

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
