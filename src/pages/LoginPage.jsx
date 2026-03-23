import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, getProfile } from '../services/auth';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await login({ username: formData.email, password: formData.password });
            const userData = await getProfile();
            loginUser(userData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col">
            <header className="w-full border-b border-slate-100 bg-white h-16 flex items-center shrink-0">
                <div className="max-w-7xl mx-auto px-6 w-full flex items-center">
                    <Link to="/" className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-2xl">auto_stories</span>
                        <span className="text-xl font-bold tracking-tight">Lumina</span>
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                                <p className="text-slate-500 mt-2 text-sm">Please enter your details to sign in to your account.</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                                    <span className="material-symbols-outlined text-red-600 !text-xl">error</span>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">Username</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-xl">mail</span>
                                        <input 
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900" 
                                            id="email" 
                                            name="email" 
                                            placeholder="Username" 
                                            type="text"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                                        <a className="text-xs font-semibold text-primary hover:underline" href="#">Forgot password?</a>
                                    </div>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-xl">lock</span>
                                        <input 
                                            className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900" 
                                            id="password" 
                                            name="password" 
                                            placeholder="••••••••" 
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <button 
                                    className={`w-full bg-primary text-white py-3.5 rounded-lg font-bold text-sm shadow-lg hover:bg-slate-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign in to Account'}
                                </button>
                            </form>
                        </div>
                        <div className="bg-slate-50 py-4 px-8 border-t border-slate-50 text-center">
                            <p className="text-sm text-slate-600">
                                Don't have an account? 
                                <Link className="font-bold text-primary hover:underline ml-1" to="/register">Register now</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="py-8 text-center text-xs text-slate-400">
                <p>© 2024 Lumina Publishing Inc. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LoginPage;
