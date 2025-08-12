import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert, AlertDescription } from './alert'

describe('Alert', () => {
  it('should render with default variant', () => {
    render(<Alert data-testid="alert">Alert message</Alert>)
    
    const alert = screen.getByTestId('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveAttribute('data-slot', 'alert')
    expect(alert).toHaveAttribute('role', 'alert')
    expect(alert).toHaveTextContent('Alert message')
  })

  it('should render with destructive variant', () => {
    render(
      <Alert variant="destructive" data-testid="alert">
        Destructive alert
      </Alert>
    )
    
    const alert = screen.getByTestId('alert')
    expect(alert.className).toMatch(/text-destructive/)
  })

  it('should merge custom className', () => {
    render(
      <Alert className="custom-class" data-testid="alert">
        Custom alert
      </Alert>
    )
    
    const alert = screen.getByTestId('alert')
    expect(alert.className).toMatch(/custom-class/)
    expect(alert.className).toMatch(/relative/)
  })

  it('should forward other props', () => {
    render(
      <Alert aria-label="Test alert" data-custom="value" data-testid="alert">
        Alert content
      </Alert>
    )
    
    const alert = screen.getByTestId('alert')
    expect(alert).toHaveAttribute('aria-label', 'Test alert')
    expect(alert).toHaveAttribute('data-custom', 'value')
  })
})

describe('AlertDescription', () => {
  it('should render with correct attributes', () => {
    render(<AlertDescription data-testid="description">Alert description</AlertDescription>)
    
    const description = screen.getByTestId('description')
    expect(description).toBeInTheDocument()
    expect(description).toHaveAttribute('data-slot', 'alert-description')
    expect(description).toHaveTextContent('Alert description')
  })

  it('should merge custom className', () => {
    render(
      <AlertDescription className="custom-class" data-testid="description">
        Description
      </AlertDescription>
    )
    
    const description = screen.getByTestId('description')
    expect(description.className).toMatch(/custom-class/)
    expect(description.className).toMatch(/text-sm/)
  })
})

describe('Alert with AlertDescription', () => {
  it('should render complete alert with description', () => {
    render(
      <Alert variant="destructive" data-testid="alert">
        <AlertDescription>Error occurred!</AlertDescription>
      </Alert>
    )
    
    expect(screen.getByTestId('alert')).toBeInTheDocument()
    expect(screen.getByText('Error occurred!')).toBeInTheDocument()
    
    const alert = screen.getByTestId('alert')
    expect(alert.className).toMatch(/text-destructive/)
  })
})