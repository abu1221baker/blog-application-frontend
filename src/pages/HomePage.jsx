import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import SkeletonCard from '../components/SkeletonCard';
import HeroSection from '../components/HeroSection';
import { getBlogs } from '../services/blog';

const HomePage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await getBlogs(search); // Pass search parameter to getBlogs
                // If the response is paginated, blogs might be in data.results
                setBlogs(data.results || data);
            } catch (err) {
                setError('Failed to fetch blogs. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const featuredBlog = blogs.length > 0 ? blogs[0] : null;
    const remainingBlogs = blogs.length > 1 ? blogs.slice(1) : [];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="max-w-[1200px] mx-auto px-6 py-8 flex-grow w-full">
                {loading ? (
                    <>
                        <div className="mb-16 aspect-[21/9] bg-slate-50 animate-pulse rounded-2xl"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                        </div>
                    </>
                ) : error ? (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
                        <h2 className="text-2xl font-bold">{error}</h2>
                    </div>
                ) : (
                    <>
                        <HeroSection blog={featuredBlog} />
                        
                        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">trending_up</span>
                                Latest Stories
                            </h2>
                            <div className="flex gap-4 text-sm font-medium">
                                <button className="text-primary border-b-2 border-primary pb-1">Recommended</button>
                                <button className="text-slate-400 hover:text-slate-600 pb-1">Newest</button>
                            </div>
                        </div>

                        {blogs.length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                <span className="material-symbols-outlined text-6xl mb-4">description</span>
                                <h2 className="text-2xl font-bold">No blogs available</h2>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {blogs.map((blog) => (
                                    <BlogCard key={blog.id} blog={blog} />
                                ))}
                            </div>
                        )}

                        <div className="flex justify-center mt-16 mb-24">
                            <button className="flex items-center gap-2 border border-slate-100 px-8 py-3 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors">
                                Load more stories
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                            </button>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
