import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from '@/components/common/EmptyState'

describe('EmptyState Component', () => {
  it('renders title, description, and triggers action callback on button click', () => {
    const handleAction = vi.fn()

    render(
      <EmptyState
        title="No Products Found"
        description="Try adjusting your active filters."
        actionLabel="Reset Filters"
        onAction={handleAction}
      />
    )

    expect(screen.getByText('No Products Found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your active filters.')).toBeInTheDocument()

    const button = screen.getByRole('button', { name: 'Reset Filters' })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })
})
