import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage/HomePage';
import { PostsPage } from './components/PostsPage';
import { AuthProvider } from './context/AuthContext';



export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Главный маршрут использует Layout как шаблон */}
          <Route path="/" element={<Layout />}>

            {/* Если путь "/", показываем HomePage внутри Outlet */}
            <Route index element={<HomePage />} />

            {/* Если путь "/posts", показываем PostsPage внутри Outlet */}
            <Route path="posts" element={<PostsPage />} />

            {/* Страница 404 (опционально) */}
            <Route path="*" element={<h2 style={{ color: 'white', textAlign: 'center' }}>404 Not Found</h2>} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}