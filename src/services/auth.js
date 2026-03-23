import api from './api';

export const login = async (credentials) => {
    const response = await api.post('auth/token/', credentials);
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('users/register/', userData);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('users/profile/');
    return response.data;
};

export const getPublicProfile = async (userId) => {
    const response = await api.get(`users/profile/${userId}/`);
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await api.patch('users/profile/', profileData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const toggleFollow = async (userId) => {
    const response = await api.post(`users/follow/${userId}/`);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};
