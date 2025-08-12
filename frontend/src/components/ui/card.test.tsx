import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with default props', () => {
      render(<Card data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('data-slot', 'card')
      expect(card.className).toMatch(/flex-col/)
      expect(card.className).toMatch(/rounded-xl/)
    })

    it('should merge custom className', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card.className).toMatch(/custom-class/)
      expect(card.className).toMatch(/flex-col/)
    })
  })

  describe('CardHeader', () => {
    it('should render with correct attributes', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>)
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveAttribute('data-slot', 'card-header')
      expect(header.className).toMatch(/grid/)
    })
  })

  describe('CardTitle', () => {
    it('should render with correct styling', () => {
      render(<CardTitle data-testid="title">Card Title</CardTitle>)
      const title = screen.getByTestId('title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-slot', 'card-title')
      expect(title.className).toMatch(/font-semibold/)
      expect(title).toHaveTextContent('Card Title')
    })
  })

  describe('CardDescription', () => {
    it('should render with muted text styling', () => {
      render(<CardDescription data-testid="description">Card description</CardDescription>)
      const description = screen.getByTestId('description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveAttribute('data-slot', 'card-description')
      expect(description.className).toMatch(/text-muted-foreground/)
      expect(description.className).toMatch(/text-sm/)
    })
  })

  describe('CardContent', () => {
    it('should render with padding', () => {
      render(<CardContent data-testid="content">Card content</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'card-content')
      expect(content.className).toMatch(/px-6/)
    })
  })

  describe('CardFooter', () => {
    it('should render with flex layout', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>)
      const footer = screen.getByTestId('footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveAttribute('data-slot', 'card-footer')
      expect(footer.className).toMatch(/flex/)
      expect(footer.className).toMatch(/items-center/)
    })
  })

  describe('CardAction', () => {
    it('should render with grid positioning', () => {
      render(<CardAction data-testid="action">Action</CardAction>)
      const action = screen.getByTestId('action')
      expect(action).toBeInTheDocument()
      expect(action).toHaveAttribute('data-slot', 'card-action')
      expect(action.className).toMatch(/col-start-2/)
    })
  })

  describe('Complete Card', () => {
    it('should render a complete card with all components', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>
            Test content
          </CardContent>
          <CardFooter>
            Footer content
          </CardFooter>
        </Card>
      )

      expect(screen.getByTestId('complete-card')).toBeInTheDocument()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test content')).toBeInTheDocument()
      expect(screen.getByText('Footer content')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
})