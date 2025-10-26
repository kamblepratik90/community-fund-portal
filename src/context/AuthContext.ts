import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
  } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const value = {
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    user: session?.user ?? null,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export const useAuth = () => useContext(AuthContext);