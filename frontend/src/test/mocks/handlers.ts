import { http, HttpResponse } from 'msw'

export const handlers = [
  // Auth endpoints
  http.post('http://localhost:8000/api/login', () => {
    return HttpResponse.json({ ok: true })
  }),

  http.post('http://localhost:8000/api/register', () => {
    return HttpResponse.json({ ok: true })
  }),

  http.post('http://localhost:8000/api/logout', () => {
    return HttpResponse.json({ ok: true })
  }),

  http.get('http://localhost:8000/api/me', () => {
    return HttpResponse.json({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      created_at: '2024-01-01T00:00:00Z'
    })
  }),

  // Profile endpoints
  http.get('http://localhost:8000/profile', () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      name: 'Test User'
    })
  }),

  http.put('http://localhost:8000/profile', () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      name: 'Updated User'
    })
  }),

  // Error responses for testing
  http.post('http://localhost:8000/api/login-error', () => {
    return HttpResponse.json(
      { detail: 'Invalid credentials' },
      { status: 401 }
    )
  }),
]