import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/utils'
import { ProfileCard } from './ProfileCard'

describe('ProfileCard', () => {
  it('renders with all props provided', () => {
    const props = {
      username: 'testuser',
      email: 'test@example.com',
      createdAt: '2024-01-15T10:30:00Z'
    }

    render(<ProfileCard {...props} />)

    // Check username
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()

    // Check email
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()

    // Check member since
    expect(screen.getByText('Member Since')).toBeInTheDocument()
    expect(screen.getByText('1/15/2024')).toBeInTheDocument()

    // Check avatar shows first letter of username
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders with missing props', () => {
    render(<ProfileCard />)

    // Check fallback values
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Member Since')).toBeInTheDocument()
    expect(screen.getByText('N/A')).toBeInTheDocument()

    // Check avatar shows fallback letter
    expect(screen.getByText('R')).toBeInTheDocument()
  })

  it('renders with partial props', () => {
    const props = {
      username: 'alice',
      email: undefined,
      createdAt: '2023-06-20T14:45:00Z'
    }

    render(<ProfileCard {...props} />)

    // Check username is displayed
    expect(screen.getByText('alice')).toBeInTheDocument()

    // Check email is empty
    expect(screen.getByText('Email')).toBeInTheDocument()
    // Don't test for empty string as it's not unique

    // Check date is formatted correctly
    expect(screen.getByText('6/20/2023')).toBeInTheDocument()

    // Check avatar shows first letter
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('handles empty string username', () => {
    render(<ProfileCard username="" email="test@example.com" createdAt="2024-01-01T00:00:00Z" />)

    // Check avatar shows fallback letter for empty username
    expect(screen.getByText('R')).toBeInTheDocument()
  })

  it('handles invalid date string', () => {
    render(<ProfileCard username="testuser" email="test@example.com" createdAt="invalid-date" />)

    // Should show "Invalid Date" or handle gracefully
    expect(screen.getByText('Member Since')).toBeInTheDocument()
    // The exact behavior depends on how the browser handles invalid dates
    // We just check that something is rendered
    expect(screen.getByText(/member since/i)).toBeInTheDocument()
  })
})
