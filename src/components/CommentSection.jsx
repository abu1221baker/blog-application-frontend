import React, { useState, useEffect } from 'react';
import { getComments, createComment } from '../services/blog';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const CommentSection = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getComments(blogId);
                setComments(data.results || data);
            } catch (err) {
                console.error('Failed to fetch comments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [blogId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        try {
            const data = await createComment({
                blog: blogId,
                body: newComment,
                parent: null
            });
            setComments([data, ...comments]);
            setNewComment('');
        } catch (err) {
            console.error('Failed to post comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-16 pt-12 border-t border-slate-100">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">chat_bubble</span>
                Responses ({comments.length})
            </h3>

            {user ? (
                <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/10">
                    <textarea 
                        className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none outline-none min-h-[100px]"
                        placeholder="What are your thoughts?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-xs text-slate-400">Commenting as <span className="font-bold text-slate-600">{user.username}</span></p>
                        <button 
                            type="submit" 
                            disabled={submitting || !newComment.trim()}
                            className={`bg-primary text-white font-bold py-2 px-6 rounded-full text-sm transition-all ${submitting ? 'opacity-50' : 'hover:bg-slate-800'}`}
                        >
                            {submitting ? 'Posting...' : 'Respond'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-12 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                    <p className="text-slate-500 mb-4 font-medium">Please sign in to join the conversation.</p>
                    <a href="/login" className="text-primary font-bold hover:underline">Sign In</a>
                </div>
            )}

            <div className="space-y-8">
                <AnimatePresence>
                    {comments.map((comment) => (
                        <motion.div 
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-transparent"
                        >
                            <div className="flex gap-4">
                                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                                     {comment.author_username?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-bold text-slate-900">{comment.author_username}</h4>
                                        <span className="text-xs text-slate-400 font-medium">• {formatDate(comment.created_at)}</span>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">{comment.body}</p>
                                    
                                    {/* Actions */}
                                    <div className="flex items-center gap-4 mt-3">
                                        <button className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-sm">favorite</span>
                                            <span className="text-[10px] font-bold">Helpful</span>
                                        </button>
                                        <button className="flex items-center gap-1 text-slate-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-sm">reply</span>
                                            <span className="text-[10px] font-bold">Reply</span>
                                        </button>
                                    </div>

                                    {/* Nested Replies Rendering if any */}
                                    {comment.children && comment.children.length > 0 && (
                                        <div className="mt-6 ml-4 pl-6 border-l-2 border-slate-50 space-y-6">
                                            {comment.children.map(reply => (
                                                <div key={reply.id} className="flex gap-3">
                                                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                                                        {reply.author_username?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <h5 className="text-sm font-bold text-slate-800">{reply.author_username}</h5>
                                                            <span className="text-[10px] text-slate-400 font-medium">{formatDate(reply.created_at)}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-600">{reply.body}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {loading && (
                    <div className="space-y-8 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-4">
                                <div className="size-10 rounded-full bg-slate-100 flex-shrink-0"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 bg-slate-100 rounded w-24"></div>
                                        <div className="h-3 bg-slate-50 rounded w-16"></div>
                                    </div>
                                    <div className="h-4 bg-slate-50 rounded w-full"></div>
                                    <div className="h-4 bg-slate-50 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && comments.length === 0 && (
                    <div className="py-20 text-center">
                        <span className="material-symbols-outlined text-slate-200 text-6xl mb-4">chat</span>
                        <p className="text-slate-400 font-medium">No responses yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
