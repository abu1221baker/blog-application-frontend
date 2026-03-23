import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import NotificationBell from './NotificationBell';
import { getImageUrl } from '../utils/helpers';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/?search=${searchQuery}`);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Logo />
                    <div className="hidden md:flex items-center gap-6">
                        <Link className="text-sm font-medium hover:text-primary transition-colors" to="/">Home</Link>
                        <Link className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" to="/write">Write</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center bg-slate-50 rounded-full px-3 py-1.5 border border-slate-100 focus-within:border-primary/20 transition-all">
                        <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                        <input 
                            className="bg-transparent border-none focus:ring-0 text-sm w-32 lg:w-48 placeholder:text-slate-400 outline-none" 
                            placeholder="Search stories" 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <NotificationBell />
                            <button onClick={logoutUser} className="text-sm font-medium text-slate-500 hover:text-primary">Sign Out</button>
                            <Link to="/profile" className="size-9 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden ring-2 ring-offset-2 ring-slate-100 hover:ring-primary/20 transition-all">
                                {user.profile?.avatar ? (
                                    <img className="w-full h-full object-cover" src={getImageUrl(user.profile.avatar)} alt={user.username} />
                                ) : (
                                    <span className="text-xs">{user.username[0].toUpperCase()}</span>
                                )}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-primary">Sign In</Link>
                            <Link to="/register" className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
