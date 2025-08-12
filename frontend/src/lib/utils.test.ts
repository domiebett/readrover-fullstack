import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', 'conditional')).toBe('base conditional')
  })

  it('should merge tailwind classes and handle conflicts', () => {
    // tailwind-merge should handle conflicting classes
    expect(cn('px-4', 'px-2')).toBe('px-2')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null, undefined, false)).toBe('')
  })

  it('should handle arrays and complex inputs', () => {
    expect(cn(['px-4', 'py-2'], 'text-white')).toBe('px-4 py-2 text-white')
  })
})