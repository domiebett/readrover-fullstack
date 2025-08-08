import { useAuthContext } from './AuthContext';
import { apiFetch } from '../utils/apiFetch';

// Usage: const fetchWithAuth = useApiFetch(); await fetchWithAuth('/me', { method: 'GET' })
export function useApiFetch() {
  const { checkAuth } = useAuthContext();

  return async function(input: RequestInfo, init?: RequestInit) {
    const res = await apiFetch(input, init);
    if (res.status === 401) {
      await checkAuth();
    }
    return res;
  };
}
