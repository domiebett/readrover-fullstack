import { describe, it, expect, vi } from 'vitest'
import { login, register, logout, getMe } from './api'
import * as apiModule from '@/lib/api'

// Mock the apiFetch function
vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(),
}))

const mockApiFetch = vi.mocked(apiModule.apiFetch)

describe('Auth API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call apiFetch with correct parameters', async () => {
      const loginPayload = { email: 'test@example.com', password: 'password123' }
      const expectedResponse = { ok: true }
      
      mockApiFetch.mockResolvedValue(expectedResponse)
      
      const result = await login(loginPayload)
      
      expect(mockApiFetch).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        body: JSON.stringify(loginPayload),
      })
      expect(result).toBe(expectedResponse)
    })
  })

  describe('register', () => {
    it('should call apiFetch with correct parameters', async () => {
      const registerPayload = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }
      const expectedResponse = { ok: true }
      
      mockApiFetch.mockResolvedValue(expectedResponse)
      
      const result = await register(registerPayload)
      
      expect(mockApiFetch).toHaveBeenCalledWith('/api/register', {
        method: 'POST',
        body: JSON.stringify(registerPayload),
      })
      expect(result).toBe(expectedResponse)
    })
  })

  describe('logout', () => {
    it('should call apiFetch with correct parameters', async () => {
      const expectedResponse = { ok: true }
      
      mockApiFetch.mockResolvedValue(expectedResponse)
      
      const result = await logout()
      
      expect(mockApiFetch).toHaveBeenCalledWith('/api/logout', {
        method: 'POST',
      })
      expect(result).toBe(expectedResponse)
    })
  })

  describe('getMe', () => {
    it('should call apiFetch with correct parameters', async () => {
      const expectedResponse = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        created_at: '2024-01-01T00:00:00Z'
      }
      
      mockApiFetch.mockResolvedValue(expectedResponse)
      
      const result = await getMe()
      
      expect(mockApiFetch).toHaveBeenCalledWith('/api/me')
      expect(result).toBe(expectedResponse)
    })
  })
})