import React from 'react';

const SkeletonCard = () => {
    return (
        <article className="flex flex-col gap-4 p-4 animate-pulse">
            <div className="aspect-[16/10] bg-slate-50 rounded-lg"></div>
            <div className="flex flex-col gap-3">
                <div className="h-4 w-24 bg-slate-100 rounded"></div>
                <div className="h-6 w-full bg-slate-100 rounded"></div>
                <div className="h-6 w-3/4 bg-slate-100 rounded"></div>
                <div className="h-4 w-full bg-slate-50 rounded"></div>
                <div className="flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                    <div className="flex flex-col gap-1">
                        <div className="h-3 w-20 bg-slate-100 rounded"></div>
                        <div className="h-2 w-12 bg-slate-50 rounded"></div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default SkeletonCard;
