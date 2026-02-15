import React, { createContext, useContext, useEffect, useState } from 'react';

interface IUser {
    id: number;
    firstName: string;
    secondName: string;
    email: string;
    avatar?: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: IUser) => void;
    logout: () => void;
    updateUserData: (updatedFields: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (newToken: string, newUser: IUser) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUserData = (updatedFields: Partial<IUser>) => {
        if (user) {
            const newUser = { ...user, ...updatedFields };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};