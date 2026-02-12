import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  avatar?: string | null; 
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;      
  token: string | null;   // JWT токен
  login: (token: string, userData: User) => void; // Функція входу
  logout: () => void;     // Функція виходу
  isAuthenticated: boolean; // Просто прапорець true/false
}

// Створюємо сам контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Створюємо Провайдер
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Цей useEffect запускається один раз при завантаженні сайту
  // Він перевіряє, чи ми вже входили раніше
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Функція Логіну (викликаємо її, коли сервер відповів "ОК")
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    
    // Зберігаємо в браузері, щоб не вилітало при оновленні сторінки
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Функція Виходу
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};