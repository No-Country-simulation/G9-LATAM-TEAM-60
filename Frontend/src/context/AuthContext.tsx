import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (username: string, pass: string) => Promise<void>;
  register: (username: string, pass: string, nombreCompleto: string) => Promise<void>;
  loginDemo: (isAdmin?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const u = await apiService.checkAuth();
        if (u) setUser(u);
      } catch (err) {
        console.error('Error verificando sesión:', err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (username: string, pass: string) => {
    setLoading(true);
    try {
      const u = await apiService.login(username, pass);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, pass: string, nombreCompleto: string) => {
    setLoading(true);
    try {
      const u = await apiService.register({ username, password: pass, nombreCompleto });
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async (isAdmin = false) => {
    setLoading(true);
    try {
      const username = isAdmin ? 'admin@energiai.com' : 'demo@energiai.com';
      const pass = isAdmin ? 'admin123' : 'demo123';
      const u = await apiService.login(username, pass);
      setUser(u);
    } catch (err) {
      const token = 'demo_offline_jwt_' + Math.random().toString(36).substring(2);
      localStorage.setItem('energiai_jwt', token);
      setUser({
        username: isAdmin ? 'admin@energiai.com' : 'demo@energiai.com',
        nombreCompleto: isAdmin ? 'Administrador EnergiAI' : 'Usuario Demo',
        role: isAdmin ? 'ADMIN' : 'USER',
        jwtToken: token
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
};
