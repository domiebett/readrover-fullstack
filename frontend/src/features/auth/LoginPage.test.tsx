import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/utils'
import userEvent from '@testing-library/user-event'
import LoginPage from './LoginPage'
import { server } from '../../test/mocks/server'
import { http, HttpResponse } from 'msw'

// Mock the navigate function
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode, to: string }) => (
      <a href={to}>{children}</a>
    ),
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form with all fields', () => {
    render(<LoginPage />)
    
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument()
  })

  it('should show validation errors for invalid inputs', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for short password', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    await user.type(passwordInput, '123')
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data and navigate on success', async () => {
    const user = userEvent.setup()
    
    // Mock successful login
    server.use(
      http.post('http://localhost:8000/api/login', () => {
        return HttpResponse.json({ ok: true })
      })
    )
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  it('should navigate to "from" parameter on successful login', async () => {
    const user = userEvent.setup()
    
    // Mock URL search params
    Object.defineProperty(window, 'location', {
      value: {
        search: '?from=/profile'
      },
      writable: true
    })
    
    server.use(
      http.post('http://localhost:8000/api/login', () => {
        return HttpResponse.json({ ok: true })
      })
    )
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile', { replace: true })
    })
  })

  it('should show error message on failed login', async () => {
    const user = userEvent.setup()
    
    // Mock failed login
    server.use(
      http.post('http://localhost:8000/api/login', () => {
        return HttpResponse.json(
          { detail: 'Invalid credentials' },
          { status: 401 }
        )
      })
    )
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('should show loading state during submission', async () => {
    const user = userEvent.setup()
    
    // Mock slow login response
    server.use(
      http.post('http://localhost:8000/api/login', () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(HttpResponse.json({ ok: true }))
          }, 100)
        })
      })
    )
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    // Should show loading state
    expect(submitButton).toBeDisabled()
    expect(screen.getByRole('button')).toHaveTextContent(/login/i)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })
  })
})