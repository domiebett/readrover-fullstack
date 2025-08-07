import { useAuthContext } from './AuthContext';
export type { AuthStatus } from './AuthContext';

export function useAuthStatus() {
  const { auth } = useAuthContext();
  return auth;
}
