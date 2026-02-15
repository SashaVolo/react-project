import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage/HomePage';
import { PostsPage } from './components/PostsPage';
import { PostPage } from './components/PostPage/PostPage';
import { ProfilePage } from './components/ProfilePage/ProfilePage';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { GlobalLoader } from './components/GlobalLoader/GlobalLoader';
import { ScrollToTop } from './components/ScrollToTop.tsx/ScrollToTop';


const AppContent = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [displayLocation, setDisplayLocation] = useState(location);

    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            setIsLoading(true);

            const timer1 = setTimeout(() => {
                setDisplayLocation(location);
                window.scrollTo(0, 0);

                const timer2 = setTimeout(() => {
                    setIsLoading(false);
                }, 400);

                return () => clearTimeout(timer2);
            }, 400);

            return () => clearTimeout(timer1);
        }
    }, [location, displayLocation]);

    return (
        <>
            <ScrollToTop />

            <AnimatePresence mode="wait">
                {isLoading && <GlobalLoader key="global-loader" />}
            </AnimatePresence>

            <div style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.5s ease-in' }}>
                <Routes location={displayLocation}>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="posts" element={<PostsPage />} />
                        <Route path="posts/:id" element={<PostPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="*" element={<h2 style={{ padding: '100px', textAlign: 'center' }}>404 Not Found</h2>} />
                    </Route>
                </Routes>
            </div>
        </>
    );
};

export function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}