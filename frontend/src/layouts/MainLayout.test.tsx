import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/utils'
import userEvent from '@testing-library/user-event'
import { MainLayout } from './MainLayout'
import { server } from '../test/mocks/server'
import { http, HttpResponse } from 'msw'

// Mock the queryClient
const mockQueryClient = {
  getQueryData: vi.fn(),
  clear: vi.fn(),
}

vi.mock('../app/queryClient', () => ({
  queryClient: mockQueryClient,
}))

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, className }: any) => (
      <a href={to} className={className}>{children}</a>
    ),
    Outlet: () => <div data-testid="outlet">Main content</div>,
  }
})

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock user data
    mockQueryClient.getQueryData.mockReturnValue({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      created_at: '2024-01-01T00:00:00Z'
    })
  })

  it('should render header with navigation and user menu', () => {
    render(<MainLayout />)
    
    // Check header elements
    expect(screen.getByRole('link', { name: /readrover/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /books/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /shelves/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /user menu/i })).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
    
    // Check main content area
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('should have proper layout structure', () => {
    render(<MainLayout />)
    
    const layout = screen.getByText('testuser').closest('.min-h-screen')
    expect(layout).toHaveClass('min-h-screen', 'flex', 'flex-col')
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('border-b')
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('flex-1')
  })

  it('should open user menu on click', async () => {
    const user = userEvent.setup()
    render(<MainLayout />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    await user.click(userMenuButton)
    
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument()
    })
  })

  it('should handle logout successfully', async () => {
    const user = userEvent.setup()
    
    // Mock successful logout
    server.use(
      http.post('http://localhost:8000/api/logout', () => {
        return HttpResponse.json({ ok: true })
      })
    )
    
    render(<MainLayout />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    await user.click(userMenuButton)
    
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument()
    })
    
    const logoutButton = screen.getByRole('menuitem', { name: /logout/i })
    await user.click(logoutButton)
    
    await waitFor(() => {
      expect(mockQueryClient.clear).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
    })
  })

  it('should show loading state during logout', async () => {
    const user = userEvent.setup()
    
    // Mock slow logout response
    server.use(
      http.post('http://localhost:8000/api/logout', () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(HttpResponse.json({ ok: true }))
          }, 100)
        })
      })
    )
    
    render(<MainLayout />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    await user.click(userMenuButton)
    
    const logoutButton = await screen.findByRole('menuitem', { name: /logout/i })
    await user.click(logoutButton)
    
    // Should show loading state
    expect(screen.getByText(/logging out/i)).toBeInTheDocument()
    expect(logoutButton).toBeDisabled()
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  it('should handle logout error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    
    // Mock failed logout
    server.use(
      http.post('http://localhost:8000/api/logout', () => {
        return HttpResponse.json(
          { detail: 'Logout failed' },
          { status: 500 }
        )
      })
    )
    
    render(<MainLayout />)
    
    const userMenuButton = screen.getByRole('button', { name: /user menu/i })
    await user.click(userMenuButton)
    
    const logoutButton = await screen.findByRole('menuitem', { name: /logout/i })
    await user.click(logoutButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to logout:', expect.any(Error))
    })
    
    consoleSpy.mockRestore()
  })

  it('should render navigation links correctly', () => {
    render(<MainLayout />)
    
    const readRoverLink = screen.getByRole('link', { name: /readrover/i })
    expect(readRoverLink).toHaveAttribute('href', '/')
    
    const booksLink = screen.getByRole('link', { name: /books/i })
    expect(booksLink).toHaveAttribute('href', '/books')
    
    const shelvesLink = screen.getByRole('link', { name: /shelves/i })
    expect(shelvesLink).toHaveAttribute('href', '/shelves')
  })
})