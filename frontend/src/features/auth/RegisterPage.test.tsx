import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/utils'
import userEvent from '@testing-library/user-event'
import RegisterPage from './RegisterPage'
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

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render registration form with all fields', () => {
    render(<RegisterPage />)
    
    expect(screen.getByRole('heading', { level: 1, name: 'Create an Account' })).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
  })

  it('should show validation errors for invalid inputs', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    await user.type(emailInput, 'invalid')
    await user.type(passwordInput, '123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for short password', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    await user.type(passwordInput, '123')
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data and navigate on success', async () => {
    const user = userEvent.setup()
    
    // Mock successful registration
    server.use(
      http.post('http://localhost:8000/api/register', () => {
        return HttpResponse.json({ ok: true })
      })
    )
    
    render(<RegisterPage />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    await user.type(usernameInput, 'testuser')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  it('should show error message on failed registration', async () => {
    const user = userEvent.setup()
    
    // Mock failed registration
    server.use(
      http.post('http://localhost:8000/api/register', () => {
        return HttpResponse.json(
          { detail: 'Username already exists' },
          { status: 400 }
        )
      })
    )
    
    render(<RegisterPage />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    await user.type(usernameInput, 'existinguser')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/username already exists/i)).toBeInTheDocument()
    })
  })

  it('should show loading state during submission', async () => {
    const user = userEvent.setup()
    
    // Mock slow registration response
    server.use(
      http.post('http://localhost:8000/api/register', () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(HttpResponse.json({ ok: true }))
          }, 100)
        })
      })
    )
    
    render(<RegisterPage />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    await user.type(usernameInput, 'testuser')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    // Should show loading state
    expect(submitButton).toBeDisabled()
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  it('should have link to login page', () => {
    render(<RegisterPage />)
    
    const loginLink = screen.getByRole('link', { name: /login/i })
    expect(loginLink).toHaveAttribute('href', '/login')
  })
})