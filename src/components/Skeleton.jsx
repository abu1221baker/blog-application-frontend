import React from 'react';

const Skeleton = ({ width, height, className = '', variant = 'rect' }) => {
    const baseClass = "bg-slate-100 animate-pulse";
    const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-lg';
    
    const style = {
        width: width || '100%',
        height: height || '20px',
    };

    return (
        <div 
            className={`${baseClass} ${variantClass} ${className}`} 
            style={style}
        ></div>
    );
};

export default Skeleton;
