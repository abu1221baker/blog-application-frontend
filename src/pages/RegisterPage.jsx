import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        first_name: '', 
        last_name: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await register({
                username: formData.username,
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                password: formData.password,
                password2: formData.confirmPassword
            });
            navigate('/login');
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const firstError = Object.values(data)[0];
                setError(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                setError('Registration failed. Please check your details.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light text-slate-900 min-h-screen flex flex-col">
            <header className="w-full border-b border-slate-100 bg-white h-16 flex items-center shrink-0">
                <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-2xl font-bold">auto_stories</span>
                        <span className="text-xl font-bold tracking-tight">Lumina</span>
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center py-12 px-6">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="p-8">
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-black text-primary mb-2">Create Account</h1>
                                <p className="text-slate-500">Join our community of writers and readers</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-sm text-red-700">
                                    <span className="material-symbols-outlined !text-xl">error</span>
                                    <p>{error}</p>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="username">Username</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-xl">person</span>
                                        <input 
                                            className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                                            id="username" 
                                            name="username" 
                                            placeholder="johndoe" 
                                            type="text"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700" htmlFor="first_name">First Name</label>
                                        <input 
                                            className="block w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm" 
                                            id="first_name" 
                                            name="first_name" 
                                            placeholder="John" 
                                            type="text"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700" htmlFor="last_name">Last Name</label>
                                        <input 
                                            className="block w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm" 
                                            id="last_name" 
                                            name="last_name" 
                                            placeholder="Doe" 
                                            type="text"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email Address</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-xl">mail</span>
                                        <input 
                                            className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                                            id="email" 
                                            name="email" 
                                            placeholder="email@example.com" 
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-xl">lock</span>
                                        <input 
                                            className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
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
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-xl">verified_user</span>
                                        <input 
                                            className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                                            id="confirmPassword" 
                                            name="confirmPassword" 
                                            placeholder="••••••••" 
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <button 
                                    className={`w-full bg-primary hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 ${loading ? 'opacity-50' : ''}`} 
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </form>
                            <div className="mt-8 text-center text-sm text-slate-500">
                                Already have an account? 
                                <Link className="text-primary font-bold hover:underline ml-1" to="/login">Log in</Link>
                            </div>
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

export default RegisterPage;
