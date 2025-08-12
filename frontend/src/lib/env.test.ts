import { describe, it, expect } from 'vitest'
import { API_URL } from './env'

describe('env', () => {
  it('should export API_URL', () => {
    expect(API_URL).toBeDefined()
    expect(typeof API_URL).toBe('string')
  })

  it('should have a valid URL format', () => {
    expect(API_URL).toMatch(/^https?:\/\//)
  })
})