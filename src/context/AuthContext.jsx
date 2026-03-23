import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, logout as authLogout } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const userData = await getProfile();
                setUser(userData);
            } catch (error) {
                console.error('Failed to load user', error);
                authLogout();
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const loginUser = (userData) => {
        setUser(userData);
    };

    const logoutUser = () => {
        authLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
