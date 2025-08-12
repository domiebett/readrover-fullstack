import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

describe('Input', () => {
  it('should render with default props', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('data-slot', 'input')
  })

  it('should render with different types', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />)
    let input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" data-testid="input" />)
    input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type="number" data-testid="input" />)
    input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('should handle user input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Type here" />)
    
    const input = screen.getByPlaceholderText('Type here')
    await user.type(input, 'Hello world')
    
    expect(input).toHaveValue('Hello world')
  })

  it('should handle disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input.className).toMatch(/disabled:opacity-50/)
  })

  it('should merge custom className', () => {
    render(<Input className="custom-class" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toMatch(/custom-class/)
    // Should still have default input classes
    expect(input.className).toMatch(/flex/)
    expect(input.className).toMatch(/h-9/)
  })

  it('should forward other props', () => {
    render(<Input data-testid="test-input" aria-label="Test input" maxLength={50} />)
    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('aria-label', 'Test input')
    expect(input).toHaveAttribute('maxLength', '50')
  })

  it('should handle onChange events', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input onChange={handleChange} placeholder="Type here" />)
    const input = screen.getByPlaceholderText('Type here')
    
    await user.type(input, 'test')
    expect(handleChange).toHaveBeenCalledTimes(4) // Called for each character
  })

  it('should apply focus styles class', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toMatch(/focus-visible:border-ring/)
    expect(input.className).toMatch(/focus-visible:ring-ring\/50/)
  })
})