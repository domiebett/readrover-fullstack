import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/utils'
import { ReadingJourneyCard } from './ReadingJourneyCard'

describe('ReadingJourneyCard', () => {
  const defaultProps = {
    booksRead: 47,
    yearsReading: 2.8,
    favoriteGenres: ['Fiction', 'Mystery', 'Historical Fiction']
  }

  it('renders with all props', () => {
    render(<ReadingJourneyCard {...defaultProps} />)

    expect(screen.getByText(/your reading journey/i)).toBeInTheDocument()
    expect(screen.getByText('47')).toBeInTheDocument()
    expect(screen.getByText(/books read/i)).toBeInTheDocument()
    expect(screen.getByText('2.8')).toBeInTheDocument()
    expect(screen.getByText(/years reading/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /your favorite genres/i })).toBeInTheDocument()
  })

  it('renders all favorite genres as badges', () => {
    render(<ReadingJourneyCard {...defaultProps} />)

    expect(screen.getByText('Fiction')).toBeInTheDocument()
    expect(screen.getByText('Mystery')).toBeInTheDocument()
    expect(screen.getByText('Historical Fiction')).toBeInTheDocument()
  })

  it('renders with zero values', () => {
    render(<ReadingJourneyCard booksRead={0} yearsReading={0} favoriteGenres={[]} />)

    expect(screen.getAllByText('0')).toHaveLength(2)
    expect(screen.getByText(/books read/i)).toBeInTheDocument()
    expect(screen.getByText(/years reading/i)).toBeInTheDocument()
  })

  it('renders with single genre', () => {
    render(<ReadingJourneyCard booksRead={10} yearsReading={1.5} favoriteGenres={['Sci-Fi']} />)

    expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('1.5')).toBeInTheDocument()
  })

  it('renders with many genres', () => {
    const manyGenres = ['Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Thriller']
    render(<ReadingJourneyCard booksRead={25} yearsReading={3.2} favoriteGenres={manyGenres} />)

    manyGenres.forEach(genre => {
      expect(screen.getByText(genre)).toBeInTheDocument()
    })
  })

  it('renders motivational message', () => {
    render(<ReadingJourneyCard {...defaultProps} />)

    expect(screen.getByText(/update your favorite genres and current reading selection to personalize your experience!/i)).toBeInTheDocument()
  })
})
