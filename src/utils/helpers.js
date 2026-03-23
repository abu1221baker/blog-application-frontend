export const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/800x400';
    if (url.startsWith('http')) return url;
    
    // Determine base URL based on environment
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isDevelopment 
        ? 'http://127.0.0.1:8000' 
        : 'https://blog-application-backend-f9xp.onrender.com';
        
    return `${baseUrl}${url}`;
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};
