import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogContent from '../components/BlogContent';
import { getBlogDetail, toggleLike, deleteBlog } from '../services/blog';
import { getImageUrl, formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import CommentSection from '../components/CommentSection';
import ConfirmModal from '../components/ConfirmModal';

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await getBlogDetail(id);
                setBlog(data);
                setIsLiked(data.is_liked || false);
                setLikeCount(data.like_count || 0);
            } catch (err) {
                setError('Failed to load blog post. It may have been removed.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleLike = async () => {
        if (!user) {
            // Redirect to login or show message
            return;
        }

        try {
            const data = await toggleLike(id);
            setIsLiked(data.is_liked);
            setLikeCount(data.like_count);
        } catch (err) {
            console.error('Failed to toggle like:', err);
        }
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteBlog(id);
            navigate(`/profile/${user?.id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to delete blog.");
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full animate-pulse">
                <div className="aspect-[21/9] bg-slate-50 rounded-2xl mb-12"></div>
                <div className="h-10 bg-slate-50 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-slate-50 rounded w-1/2 mb-12"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-slate-50 rounded w-full"></div>
                    <div className="h-4 bg-slate-50 rounded w-full"></div>
                    <div className="h-4 bg-slate-50 rounded w-2/3"></div>
                </div>
            </main>
            <Footer />
        </div>
    );

    if (error || !blog) return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-20 flex-grow text-center">
                <span className="material-symbols-outlined text-slate-300 text-8xl mb-4">search_off</span>
                <h2 className="text-3xl font-bold mb-6">{error || 'Blog not found'}</h2>
                <Link to="/" className="text-primary font-bold hover:underline">Return to Home</Link>
            </main>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full">
                <Link 
                    to="/" 
                    className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors group"
                >
                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                    <span className="text-sm font-bold">Back to Home</span>
                </Link>
                <header className="mb-12">
                   <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden mb-10 shadow-xl shadow-slate-100 bg-slate-50">
                        <img 
                            className="w-full h-full object-cover" 
                            src={getImageUrl(blog.hero_banner)} 
                            alt={blog.title} 
                        />
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-2 items-center">
                            <span className="px-3 py-1 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                                {blog.category || 'Article'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium ml-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                {blog.views_count || 0} views
                            </span>
                        </div>
                       <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                            {blog.title}
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed font-medium">
                            {blog.hero_subtitle}
                        </p>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-12 relative">
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="lg:sticky lg:top-28 space-y-8">
                            <div className="flex lg:flex-col items-center lg:items-start gap-4">
                                <div className="size-16 lg:size-20 rounded-2xl overflow-hidden ring-4 ring-slate-50 bg-slate-50">
                                    {blog.author.profile?.avatar ? (
                                        <img className="w-full h-full object-cover" src={getImageUrl(blog.author.profile.avatar)} alt={blog.author.username} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-primary text-white">
                                            {blog.author.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold text-slate-900">{blog.author.username}</h3>
                                    <p className="text-sm text-slate-500 mb-2">{blog.author.profile?.bio || 'Writer'}</p>
                                    <p className="text-xs font-medium text-slate-400">Published {formatDate(blog.created_at)}</p>
                                </div>
                            </div>

                            {user && user?.id == blog?.author?.id && (
                                <div className="flex flex-col gap-2 pt-4 border-t border-slate-50">
                                    <Link to={`/edit/${blog.id}`} className="w-full focus:outline-none bg-slate-100 text-slate-600 text-center text-sm font-bold py-2.5 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Edit Story
                                    </Link>
                                    <button 
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className="w-full focus:outline-none bg-red-50 text-red-600 text-center text-sm font-bold py-2.5 rounded-lg hover:bg-red-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                        {isDeleting ? 'Deleting...' : 'Delete Story'}
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                                <Link to={`/profile/${blog.author.id}`} className="flex-1 bg-primary text-white text-center text-sm font-bold py-2 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all">View Profile</Link>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 max-w-none">
                        <BlogContent contents={blog.contents} />
                        
                        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={handleLike}
                                    className="flex items-center gap-2 group"
                                >
                                    <motion.div 
                                        whileTap={{ scale: 0.8 }}
                                        animate={{ 
                                            scale: isLiked ? [1, 1.2, 1] : 1,
                                            color: isLiked ? '#ef4444' : '#64748b'
                                        }}
                                        className={`size-12 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-red-50' : 'bg-slate-50'}`}
                                    >
                                        <span className={`material-symbols-outlined ${isLiked ? 'fill-1' : ''}`} style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>
                                            favorite
                                        </span>
                                    </motion.div>
                                    <span className={`font-bold ${isLiked ? 'text-red-500' : 'text-slate-600'}`}>
                                        {likeCount} Likes
                                    </span>
                                </button>
                                <button className="flex items-center gap-2 group">
                                    <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                        <span className="material-symbols-outlined">mode_comment</span>
                                    </div>
                                    <span className="font-bold text-slate-600">Responses</span>
                                </button>
                            </div>
                        </div>
                        {/* Comment Section */}
                        <CommentSection blogId={id} />
                    </div>
                </div>
            </main>
            <Footer />
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Story"
                message="Are you sure you want to delete this story? This action cannot be undone."
                processing={isDeleting}
            />
        </div>
    );
};

export default BlogDetailPage;
