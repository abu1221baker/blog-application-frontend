import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <div className="h-16 border-b border-slate-100 flex items-center px-6 animate-pulse">
                    <div className="size-8 bg-slate-50 rounded-lg"></div>
                    <div className="ml-auto flex gap-4">
                        <div className="w-20 h-8 bg-slate-50 rounded-full"></div>
                        <div className="w-8 h-8 bg-slate-50 rounded-full"></div>
                    </div>
                </div>
                <main className="max-w-4xl mx-auto px-6 py-12 w-full animate-pulse">
                    <div className="h-10 bg-slate-50 rounded w-1/2 mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-slate-50 rounded w-full"></div>
                        <div className="h-4 bg-slate-50 rounded w-full"></div>
                        <div className="h-4 bg-slate-50 rounded w-2/3"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
