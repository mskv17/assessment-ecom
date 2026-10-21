import React from 'react'
import { Plus, Minus } from 'lucide-react'

export interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  max?: number;
  min?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  max = 99,
  min = 1,
  size = 'md',
  disabled = false,
}) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    if (isNaN(val)) return
    const clamped = Math.max(min, Math.min(val, max))
    onQuantityChange(clamped)
  }

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  }

  const btnWidth = {
    sm: 'w-8',
    md: 'w-10',
    lg: 'w-12',
  }

  return (
    <div
      className={`inline-flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-2xs ${sizeClasses[size]}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
        className={`${btnWidth[size]} h-full flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer select-none`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        aria-label="Item quantity"
        className="w-11 text-center font-semibold text-stone-800 bg-transparent focus:outline-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
        className={`${btnWidth[size]} h-full flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer select-none`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
