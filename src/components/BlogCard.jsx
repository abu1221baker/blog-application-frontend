import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/helpers';

const BlogCard = ({ blog }) => {
    return (
        <article className="group cursor-pointer flex flex-col gap-4 bg-white p-4 rounded-xl border border-transparent hover:border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Link to={`/blog/${blog.id}`} className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-50">
                <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    src={getImageUrl(blog.hero_banner)} 
                    alt={blog.title} 
                />
            </Link>
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase">
                        {blog.category || 'Opinion'}
                    </span>
                    <span className="text-[11px] text-slate-400">• {blog.read_time || '5 min read'}</span>
                    <span className="text-[11px] text-slate-400">• {blog.views_count || 0} views</span>
                </div>
                <Link to={`/blog/${blog.id}`}>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                        {blog.title}
                    </h3>
                </Link>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                    {blog.hero_subtitle || 'Discover the latest insights and stories from our community.'}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                            {blog.author.profile?.avatar ? (
                                <img className="w-full h-full object-cover" src={getImageUrl(blog.author.profile.avatar)} alt={blog.author.username} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500 bg-slate-200">
                                    {blog.author.username[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-bold">{blog.author.username}</p>
                            <p className="text-[10px] text-slate-400">{new Date(blog.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
