import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = "" }) => {
    return (
        <Link to="/" className={`flex items-center gap-2 text-primary ${className}`}>
            <span className="material-symbols-outlined text-3xl">auto_stories</span>
            <span className="text-xl font-extrabold tracking-tight">Lumina</span>
        </Link>
    );
};

export default Logo;
