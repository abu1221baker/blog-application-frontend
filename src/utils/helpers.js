export const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/800x400';
    if (url.startsWith('http')) return url;
    const baseUrl = 'http://127.0.0.1:8000';
    return `${baseUrl}${url}`;
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};
