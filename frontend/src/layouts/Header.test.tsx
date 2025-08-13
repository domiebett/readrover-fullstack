import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/utils'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'
import { server } from '../test/mocks/server'
import { http, HttpResponse } from 'msw'

// Mock the navigate function like other tests
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Header', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('renders unauthenticated state with Login and Sign Up links and logo to root', async () => {
    server.use(
      http.get('http://localhost:8000/api/me', () => new HttpResponse(null, { status: 401 }))
    )

    render(<Header />)

    // Shows auth links
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
    })

    // Logo points to landing page when not authenticated
    expect(screen.getByRole('link', { name: /booknook/i })).toHaveAttribute('href', '/')

    // Links point to correct destinations
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/register')

    // App navigation is hidden when not authenticated
    expect(screen.queryByRole('link', { name: /books/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /shelves/i })).not.toBeInTheDocument()
  })

  it('renders authenticated state with app navigation and user menu', async () => {
    render(<Header />)
    const user = userEvent.setup()

    // App navigation visible
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /books/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /shelves/i })).toBeInTheDocument()
    })

    // Logo points to /home when authenticated in app mode
    expect(screen.getByRole('link', { name: /booknook/i })).toHaveAttribute('href', '/home')

    // Open user menu and navigate to profile
    await user.click(screen.getByText('testuser'))
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('menuitem', { name: /profile/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/profile')
  })

  it('logs out and navigates to /login', async () => {
    render(<Header />)
    const user = userEvent.setup()

    // Wait for authenticated state to load
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument()
    })

    // Open user menu and click logout
    await user.click(screen.getByText('testuser'))
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument())
    await user.click(screen.getByRole('menuitem', { name: /logout/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
    })
  })

  it('renders landing mode for authenticated user with "Go to Library" link and logo to root', async () => {
    render(<Header mode="landing" />)

    // Shows landing action
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /go to library/i })).toBeInTheDocument()
    })

    // The surrounding link points to /home
    const goButton = screen.getByRole('button', { name: /go to library/i })
    const goLink = goButton.closest('a')
    expect(goLink).not.toBeNull()
    expect(goLink).toHaveAttribute('href', '/home')

    // Navigation menu hidden in landing mode
    expect(screen.queryByRole('link', { name: /books/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /shelves/i })).not.toBeInTheDocument()

    // Logo points to landing page in landing mode
    expect(screen.getByRole('link', { name: /booknook/i })).toHaveAttribute('href', '/')
  })
})
