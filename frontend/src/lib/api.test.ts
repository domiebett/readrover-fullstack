import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpError, apiFetch } from './api'
import { server } from '../test/mocks/server'
import { http, HttpResponse } from 'msw'

// Mock the authEvents module
vi.mock('../app/authEvents', () => ({
  authEvents: {
    emitUnauthorized: vi.fn(),
  },
}))

describe('HttpError', () => {
  it('should create an error with status and message', () => {
    const error = new HttpError(404, 'Not found')
    expect(error.status).toBe(404)
    expect(error.message).toBe('Not found')
    expect(error).toBeInstanceOf(Error)
  })
})

describe('apiFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should make successful GET request', async () => {
    server.use(
      http.get('http://localhost:8000/test', () => {
        return HttpResponse.json({ success: true })
      })
    )

    const result = await apiFetch('/test')
    expect(result).toEqual({ success: true })
  })

  it('should make successful POST request with data', async () => {
    server.use(
      http.post('http://localhost:8000/test', async ({ request }) => {
        const body = await request.json()
        return HttpResponse.json({ received: body })
      })
    )

    const testData = { name: 'test' }
    const result = await apiFetch('/test', {
      method: 'POST',
      body: JSON.stringify(testData),
    })
    
    expect(result).toEqual({ received: testData })
  })

  it('should handle non-JSON responses', async () => {
    server.use(
      http.get('http://localhost:8000/empty', () => {
        return new HttpResponse('', { status: 204 })
      })
    )

    const result = await apiFetch('/empty')
    expect(result).toBeNull()
  })

  it('should throw HttpError on 4xx/5xx responses', async () => {
    server.use(
      http.get('http://localhost:8000/error', () => {
        return HttpResponse.json(
          { detail: 'Bad request' },
          { status: 400 }
        )
      })
    )

    await expect(apiFetch('/error')).rejects.toThrow(HttpError)
    
    try {
      await apiFetch('/error')
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError)
      expect((error as HttpError).status).toBe(400)
      expect((error as HttpError).message).toBe('Bad request')
    }
  })

  it('should emit unauthorized event on 401 status', async () => {
    const { authEvents } = await import('../app/authEvents')
    
    server.use(
      http.get('http://localhost:8000/unauthorized', () => {
        return HttpResponse.json(
          { detail: 'Unauthorized' },
          { status: 401 }
        )
      })
    )

    await expect(apiFetch('/unauthorized')).rejects.toThrow(HttpError)
    expect(authEvents.emitUnauthorized).toHaveBeenCalled()
  })

  it('should include credentials and content-type headers', async () => {
    let requestHeaders: Headers | undefined

    server.use(
      http.get('http://localhost:8000/headers', ({ request }) => {
        requestHeaders = request.headers
        return HttpResponse.json({ success: true })
      })
    )

    await apiFetch('/headers')
    
    expect(requestHeaders?.get('Content-Type')).toBe('application/json')
  })
})