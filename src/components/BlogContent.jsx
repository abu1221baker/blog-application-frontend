import React from 'react';
import { getImageUrl } from '../utils/helpers';

const BlogContent = ({ contents }) => {
    if (!contents || contents.length === 0) return null;

    return (
        <div className="prose prose-slate prose-lg max-w-none">
            {contents.map((block) => (
                <div key={block.id} className="mb-8">
                    {block.content_type === 'text' ? (
                        <div 
                            className="text-xl leading-relaxed text-slate-700"
                            dangerouslySetInnerHTML={{ __html: block.text }}
                        />
                    ) : (
                        <div className="my-12 rounded-xl overflow-hidden bg-slate-50 p-8 border border-slate-100">
                            <img 
                                className="w-full h-auto rounded-lg shadow-sm mb-4" 
                                src={getImageUrl(block.image)} 
                                alt="Blog content" 
                            />
                            {block.caption && (
                                <p className="text-sm text-center text-slate-500 italic">{block.caption}</p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BlogContent;
