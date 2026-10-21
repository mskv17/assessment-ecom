import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuantitySelector } from '@/components/common/QuantitySelector'

describe('QuantitySelector Component', () => {
  it('renders current quantity accurately', () => {
    render(<QuantitySelector quantity={3} onQuantityChange={() => {}} />)
    const input = screen.getByLabelText('Item quantity') as HTMLInputElement
    expect(input.value).toBe('3')
  })

  it('calls onQuantityChange with incremented value when plus clicked', () => {
    const handleChange = vi.fn()
    render(<QuantitySelector quantity={2} onQuantityChange={handleChange} max={10} />)

    const plusBtn = screen.getByLabelText('Increase quantity')
    fireEvent.click(plusBtn)

    expect(handleChange).toHaveBeenCalledWith(3)
  })

  it('calls onQuantityChange with decremented value when minus clicked', () => {
    const handleChange = vi.fn()
    render(<QuantitySelector quantity={4} onQuantityChange={handleChange} min={1} />)

    const minusBtn = screen.getByLabelText('Decrease quantity')
    fireEvent.click(minusBtn)

    expect(handleChange).toHaveBeenCalledWith(3)
  })

  it('disables minus button when quantity equals min', () => {
    render(<QuantitySelector quantity={1} onQuantityChange={() => {}} min={1} />)

    const minusBtn = screen.getByLabelText('Decrease quantity')
    expect(minusBtn).toBeDisabled()
  })

  it('disables plus button when quantity equals max', () => {
    render(<QuantitySelector quantity={5} onQuantityChange={() => {}} max={5} />)

    const plusBtn = screen.getByLabelText('Increase quantity')
    expect(plusBtn).toBeDisabled()
  })
})
