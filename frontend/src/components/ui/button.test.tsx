import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('data-slot', 'button')
  })

  it('should render different variants correctly', () => {
    const { rerender } = render(<Button variant="destructive">Destructive</Button>)
    let button = screen.getByRole('button')
    expect(button.className).toMatch(/bg-destructive/)

    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByRole('button')
    expect(button.className).toMatch(/border/)

    rerender(<Button variant="ghost">Ghost</Button>)
    button = screen.getByRole('button')
    expect(button.className).toMatch(/hover:bg-accent/)
  })

  it('should render different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByRole('button')
    expect(button.className).toMatch(/h-8/)

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button')
    expect(button.className).toMatch(/h-10/)

    rerender(<Button size="icon">Icon</Button>)
    button = screen.getByRole('button')
    expect(button.className).toMatch(/size-9/)
  })

  it('should handle disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button.className).toMatch(/disabled:opacity-50/)
  })

  it('should handle click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    const button = screen.getByRole('button')
    
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should render as different element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: 'Link button' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveAttribute('data-slot', 'button')
  })

  it('should merge custom className with button variants', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toMatch(/custom-class/)
    // Should still have the default button classes
    expect(button.className).toMatch(/inline-flex/)
  })

  it('should forward other props to the button element', () => {
    render(<Button data-testid="test-button" aria-label="Test button">Button</Button>)
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('aria-label', 'Test button')
  })
})