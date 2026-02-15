import React, { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = [
  {
    id: 'original',
    name: 'Luppiter',
    background: "linear-gradient(to top right, #FB7BD1 0%, #390050 100%)",
    icon: '🪐'
  },
  {
    id: 'forest',
    name: 'Forest',
    background: 'linear-gradient(120deg, #8d4b77ff 0%, #5bff70ff 100%)',
    icon: '🌿'
  },
  {
    id: 'night',
    name: 'Night',
    background: 'linear-gradient(to top right, #494949ff 0%, #252229ff 100%)',
    icon: '🌃'
  },
  {
    id: 'dark',
    name: 'Space',
    background: 'linear-gradient(to top right, #7bf2fb 0%, #390050 100%)',
    icon: '🌑'
  }
];

interface ThemeContextType {
  currentTheme: string;
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'original';
  });

  useEffect(() => {
    const selectedTheme = THEMES.find(t => t.id === currentTheme);
    if (selectedTheme) {
      document.body.style.background = selectedTheme.background;
      document.body.style.transition = 'background 0.5s ease'; // Плавна зміна
      
      localStorage.setItem('app-theme', currentTheme);
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};