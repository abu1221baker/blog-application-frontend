import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog, createBlogContent } from '../services/blog';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WriteBlogPage = () => {
    const [metadata, setMetadata] = useState({
        title: '',
        hero_title: '',
        hero_subtitle: '',
        hero_banner: null,
        is_published: true
    });
    const [contents, setContents] = useState([
        { content_type: 'text', text: '', image: null, order: 0 }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleMetadataChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setMetadata({
            ...metadata,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
        });
    };

    const handleContentChange = (index, field, value) => {
        const newContents = [...contents];
        newContents[index][field] = value;
        setContents(newContents);
    };

    const addContentBlock = (type) => {
        setContents([
            ...contents,
            { content_type: type, text: '', image: null, order: contents.length }
        ]);
    };

    const removeContentBlock = (index) => {
        const newContents = contents.filter((_, i) => i !== index).map((block, i) => ({
            ...block,
            order: i
        }));
        setContents(newContents);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Create Blog Metadata
            const blogFormData = new FormData();
            blogFormData.append('title', metadata.title);
            blogFormData.append('hero_title', metadata.hero_title);
            blogFormData.append('hero_subtitle', metadata.hero_subtitle);
            if (metadata.hero_banner) {
                blogFormData.append('hero_banner', metadata.hero_banner);
            }
            blogFormData.append('is_published', metadata.is_published);

            const blog = await createBlog(blogFormData);

            // 2. Create Content Blocks
            for (const block of contents) {
                const contentFormData = new FormData();
                contentFormData.append('content_type', block.content_type);
                contentFormData.append('order', block.order);
                if (block.content_type === 'text') {
                    contentFormData.append('text', block.text);
                } else if (block.content_type === 'image' && block.image) {
                    contentFormData.append('image', block.image);
                }
                await createBlogContent(blog.id, contentFormData);
            }

            navigate(`/blog/${blog.id}`);
        } catch (err) {
            setError('Failed to create blog. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white text-slate-900 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl font-black text-primary mb-4">Write your story</h1>
                        <p className="text-slate-500">Compose a masterpiece that will inspire the world.</p>
                    </header>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700">
                            <span className="material-symbols-outlined">error</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Metadata Section */}
                        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit_note</span>
                                Blog Details
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">Main Title</label>
                                    <input 
                                        type="text" name="title" value={metadata.title} onChange={handleMetadataChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                                        placeholder="Enter an catchy title..." required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5">Hero Title</label>
                                        <input 
                                            type="text" name="hero_title" value={metadata.hero_title} onChange={handleMetadataChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                                            placeholder="Optional display title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5">Hero Subtitle</label>
                                        <input 
                                            type="text" name="hero_subtitle" value={metadata.hero_subtitle} onChange={handleMetadataChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                                            placeholder="Catchy subtitle"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">Hero Banner</label>
                                    <div className="relative group">
                                        <input 
                                            type="file" name="hero_banner" onChange={handleMetadataChange} accept="image/*"
                                            className="hidden" id="hero_banner_input"
                                        />
                                        <label 
                                            htmlFor="hero_banner_input"
                                            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl p-8 cursor-pointer hover:border-primary/30 transition-all bg-slate-50/50"
                                        >
                                            {metadata.hero_banner ? (
                                                <div className="text-center">
                                                    <span className="material-symbols-outlined text-green-500 mb-2">check_circle</span>
                                                    <p className="text-sm font-medium">{metadata.hero_banner.name}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">add_photo_alternate</span>
                                                    <p className="text-sm font-medium">Click to upload hero banner</p>
                                                    <p className="text-xs text-slate-500 mt-1">Recommended size: 1200x600px</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Content Blocks Section */}
                        <section className="space-y-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">view_quilt</span>
                                Story Content
                            </h2>

                            <div className="space-y-8">
                                {contents.map((block, index) => (
                                    <div key={index} className="relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group">
                                        <button 
                                            type="button" onClick={() => removeContentBlock(index)}
                                            className="absolute -right-3 -top-3 size-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <span className="material-symbols-outlined text-base font-bold">close</span>
                                        </button>

                                        {block.content_type === 'text' ? (
                                            <textarea 
                                                className="w-full bg-transparent border-none focus:ring-0 text-lg leading-relaxed placeholder:text-slate-300 resize-none outline-none min-h-[150px]"
                                                placeholder="Tell your story..."
                                                value={block.text}
                                                onChange={(e) => handleContentChange(index, 'text', e.target.value)}
                                            />
                                        ) : (
                                            <div className="space-y-4">
                                                <input 
                                                    type="file" accept="image/*"
                                                    onChange={(e) => handleContentChange(index, 'image', e.target.files[0])}
                                                    id={`image_input_${index}`} className="hidden"
                                                />
                                                <label 
                                                    htmlFor={`image_input_${index}`}
                                                    className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-all font-bold"
                                                >
                                                    {block.image ? (
                                                        <div className="text-center">
                                                            <span className="material-symbols-outlined text-green-500 mb-2">check_circle</span>
                                                            <p className="text-sm">{block.image.name}</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined text-slate-300 text-3xl mb-1">image</span>
                                                            <p className="text-xs text-slate-400">Upload Image Block</p>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        )}
                                        <div className="mt-4 flex justify-end">
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300">Block #{index + 1} • {block.content_type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-center gap-4 py-8">
                                <button 
                                    type="button" onClick={() => addContentBlock('text')}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-100 hover:bg-slate-50 transition-all text-sm font-bold"
                                >
                                    <span className="material-symbols-outlined text-primary">add_circle</span>
                                    Add Text
                                </button>
                                <button 
                                    type="button" onClick={() => addContentBlock('image')}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-100 hover:bg-slate-50 transition-all text-sm font-bold"
                                >
                                    <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
                                    Add Image
                                </button>
                            </div>
                        </section>

                        <div className="pt-12 border-t border-slate-100 flex justify-end">
                            <button 
                                type="submit" disabled={loading}
                                className={`bg-primary hover:bg-slate-800 text-white font-bold py-4 px-12 rounded-full transition-all shadow-xl shadow-primary/20 ${loading ? 'opacity-50' : ''}`}
                            >
                                {loading ? 'Publishing...' : 'Publish Story'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default WriteBlogPage;
