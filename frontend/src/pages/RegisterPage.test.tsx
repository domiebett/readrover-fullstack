import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/utils'
import userEvent from '@testing-library/user-event'
import RegisterPage from './RegisterPage'
import { server } from '../test/mocks/server'
import { http, HttpResponse } from 'msw'

// Mock the navigate function
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('RegisterPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('renders correctly', () => {
    render(<RegisterPage />)
    expect(screen.getByRole('heading', { name: /join booknook/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('validates inputs', async () => {
    render(<RegisterPage />)
    const user = userEvent.setup()

    // Click submit without filling any fields
    await user.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByTestId('username-error')).toHaveTextContent(/username/i)
      expect(screen.getByTestId('email-error')).toHaveTextContent(/email/i)
      expect(screen.getByTestId('password-error')).toHaveTextContent(/password/i)
    })

    // Enter invalid email
    await user.type(screen.getByLabelText(/email/i), 'invalid')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent(/email/i)
    })

    // Enter short password
    await user.type(screen.getByLabelText(/password/i), '12345')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByTestId('password-error')).toHaveTextContent(/6 characters/i)
    })
  })

  it('handles successful registration', async () => {
    render(<RegisterPage />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  it.skip('handles registration failure', async () => {
    server.use(
      http.post('/api/register', () => {
        return new HttpResponse(null, { status: 400 })
      })
    )

    render(<RegisterPage />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
    })
  })

  it('navigates to login page', async () => {
    render(<RegisterPage />)
    const user = userEvent.setup()

    await user.click(screen.getByText(/sign in/i))
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
  })
})
