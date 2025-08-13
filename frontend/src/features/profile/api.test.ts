import { describe, it, expect } from 'vitest'
import { getProfile, profileKeys } from './api'

describe('Profile API', () => {
  it('exports profileKeys with correct structure', () => {
    expect(profileKeys.all).toEqual(['profile'])
    expect(profileKeys.profile()).toEqual(['profile'])
  })

  it('getProfile function exists', () => {
    expect(typeof getProfile).toBe('function')
  })
})
