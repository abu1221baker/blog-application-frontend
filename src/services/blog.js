import api from './api';

export const getBlogs = async (search = '') => {
    const url = search ? `blogs/?search=${encodeURIComponent(search)}` : 'blogs/';
    const response = await api.get(url);
    return response.data;
};

export const getBlogDetail = async (id) => {
    const response = await api.get(`blogs/${id}/`);
    return response.data;
};

export const createBlog = async (blogData) => {
    const response = await api.post('blogs/', blogData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
export const createBlogContent = async (blogId, contentData) => {
    const response = await api.post(`blogs/${blogId}/contents/`, contentData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
export const toggleLike = async (blogId) => {
    const response = await api.post(`likes/toggle/${blogId}/`);
    return response.data;
};

export const getComments = async (blogId) => {
    const response = await api.get(`comments/?blog_id=${blogId}`);
    return response.data;
};

export const createComment = async (commentData) => {
    const response = await api.post('comments/', commentData);
    return response.data;
};

export const getUserBlogs = async (authorId) => {
    const response = await api.get(`blogs/?author_id=${authorId}`);
    return response.data;
};

export const updateBlog = async (id, blogData) => {
    const response = await api.patch(`blogs/${id}/`, blogData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteBlog = async (id) => {
    const response = await api.delete(`blogs/${id}/`);
    return response.data;
};

export const deleteBlogContent = async (blogId, contentId) => {
    const response = await api.delete(`blogs/${blogId}/contents/${contentId}/`);
    return response.data;
};

export const updateBlogContent = async (blogId, contentId, contentData) => {
    const response = await api.patch(`blogs/${blogId}/contents/${contentId}/`, contentData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
