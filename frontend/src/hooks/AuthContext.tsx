import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { setGlobal401Handler, apiFetch } from '../utils/apiFetch';
import { useNavigate } from 'react-router-dom';

export type AuthStatus = 'pending' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  auth: AuthStatus;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthStatus>('pending');
  const navigate = useNavigate();

  const checkAuth = async () => {
    setAuth('pending');
    try {
      const res = await fetch('/api/me', { credentials: 'include' });
      setAuth(res.ok ? 'authenticated' : 'unauthenticated');
    } catch {
      setAuth('unauthenticated');
    }
  };

  // Set up global 401 handler
  useEffect(() => {
    setGlobal401Handler(async () => {
      setAuth('unauthenticated');
      await apiFetch('/logout', { method: 'POST' });
      navigate('/login', { replace: true });
    });
  }, [navigate]);

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
