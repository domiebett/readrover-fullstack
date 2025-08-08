import { apiFetch } from '../utils/apiFetch';

// Usage: const fetchWithAuth = useApiFetch(); await fetchWithAuth('/me', { method: 'GET' })
export function useApiFetch() {
  return async function(input: RequestInfo, init?: RequestInit) {
    return apiFetch(input, init);
  };
}
