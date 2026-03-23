import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, formatDate } from '../utils/helpers';

const HeroSection = ({ blog }) => {
    if (!blog) return null;

    return (
        <section className="mb-16">
            <Link to={`/blog/${blog.id}`} className="group relative overflow-hidden rounded-2xl bg-slate-900 aspect-[21/9] flex items-end">
                <img 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                    src={getImageUrl(blog.hero_banner)} 
                    alt={blog.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="relative p-8 md:p-12 max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Featured</span>
                        <span className="text-slate-300 text-sm">
                            {formatDate(blog.created_at)}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                        {blog.title}
                    </h1>
                    <p className="text-slate-200 text-lg mb-6 line-clamp-2">
                        {blog.hero_subtitle || 'Discover the latest stories from our global community.'}
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden">
                            {blog.author.profile?.avatar ? (
                                <img className="w-full h-full object-cover" src={getImageUrl(blog.author.profile.avatar)} alt={blog.author.username} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-primary">
                                    {blog.author.username[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="text-white">
                            <p className="text-sm font-bold">{blog.author.username}</p>
                            <p className="text-xs text-slate-300">{blog.author.profile?.bio?.substring(0, 30) || 'Author'}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </section>
    );
};

export default HeroSection;
