import { BASE_URL } from '../services/api';

export const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/800x400';
    if (url.startsWith('http')) return url;
    
    return `${BASE_URL}${url}`;
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};
