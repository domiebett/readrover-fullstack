import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/utils'
import { ReadingStatsCard } from './ReadingStatsCard'

describe('ReadingStatsCard', () => {
  it('renders with current reading book', () => {
    render(<ReadingStatsCard currentReading="The Great Gatsby" />)

    expect(screen.getByText(/currently reading/i)).toBeInTheDocument()
    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
    expect(screen.getByText(/keep up the great reading!/i)).toBeInTheDocument()
  })

  it('renders with empty string', () => {
    render(<ReadingStatsCard currentReading="" />)

    expect(screen.getByText(/currently reading/i)).toBeInTheDocument()
    // Don't test for empty string as it's not unique
  })

  it('renders with long book title', () => {
    const longTitle = "The Very Long Book Title That Goes On And On And On And On And On"
    render(<ReadingStatsCard currentReading={longTitle} />)

    expect(screen.getByText(longTitle)).toBeInTheDocument()
  })
})
