

let on401: (() => void) | null = null;
export function setGlobal401Handler(handler: () => void) {
  on401 = handler;
}

// Usage: await apiFetch('/me', { method: 'GET' })
export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  let url = typeof input === 'string' ? input : input.url;
  if (url.startsWith('/')) {
    if (!url.startsWith('/api/')) {
      url = '/api' + url;
    }
  }
  try {
    const res = await fetch(url, { ...init, credentials: 'include' });
    if (res.status === 401 && on401) {
      on401();
    }
    return res;
  } catch (err) {
    throw err;
  }
}
