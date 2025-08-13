import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/utils'
import ProfilePage from './ProfilePage'

// Mock the useProfile hook
const mockUseProfile = vi.fn()
vi.mock('../features/profile/hooks/useProfile', () => ({
  useProfile: () => mockUseProfile(),
}))

describe('ProfilePage', () => {
  const mockProfile = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z'
  }

  beforeEach(() => {
    mockUseProfile.mockReset()
  })

  it('renders loading state', () => {
    mockUseProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    })

    render(<ProfilePage />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load profile')
    })

    render(<ProfilePage />)
    expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument()
  })

  it('renders profile data successfully', async () => {
    mockUseProfile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      error: null
    })

    render(<ProfilePage />)

    // Check main heading
    expect(screen.getByText(/welcome back, testuser!/i)).toBeInTheDocument()
    expect(screen.getByText(/continue your literary journey/i)).toBeInTheDocument()

    // Check that profile data is displayed
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    // Check reading stats
    expect(screen.getByText(/currently reading/i)).toBeInTheDocument()
    expect(screen.getByText(/the seven husbands of evelyn hugo/i)).toBeInTheDocument()

    // Check reading journey
    expect(screen.getByText(/your reading journey/i)).toBeInTheDocument()
    expect(screen.getByText('47')).toBeInTheDocument()
    expect(screen.getByText(/books read/i)).toBeInTheDocument()
    expect(screen.getByText('2.8')).toBeInTheDocument()
    expect(screen.getByText(/years reading/i)).toBeInTheDocument()

    // Check favorite genres
    expect(screen.getByRole('heading', { name: /your favorite genres/i })).toBeInTheDocument()
    expect(screen.getByText('Fiction')).toBeInTheDocument()
    expect(screen.getByText('Mystery')).toBeInTheDocument()
    expect(screen.getByText('Historical Fiction')).toBeInTheDocument()
  })

  it('renders fallback username when profile data is missing', () => {
    mockUseProfile.mockReturnValue({
      data: { ...mockProfile, username: undefined },
      isLoading: false,
      error: null
    })

    render(<ProfilePage />)
    expect(screen.getByText(/welcome back, reader!/i)).toBeInTheDocument()
  })
})
