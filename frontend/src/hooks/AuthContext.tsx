import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type AuthStatus = 'pending' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  auth: AuthStatus;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthStatus>('pending');

  const checkAuth = async () => {
    setAuth('pending');
    try {
      const res = await fetch('/api/protected', { credentials: 'include' });
      setAuth(res.ok ? 'authenticated' : 'unauthenticated');
    } catch {
      setAuth('unauthenticated');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
