import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/utils'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('should render welcome message', () => {
    render(<HomePage />)
    
    expect(screen.getByRole('heading', { name: /welcome to readrover/i })).toBeInTheDocument()
    expect(screen.getByText(/your reading journey starts here/i)).toBeInTheDocument()
  })

  it('should have proper structure and styling', () => {
    render(<HomePage />)
    
    const container = screen.getByText(/your reading journey starts here/i).closest('div')
    expect(container).toHaveClass('container', 'py-10')
    
    const heading = screen.getByRole('heading', { name: /welcome to readrover/i })
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'mb-6')
  })
})