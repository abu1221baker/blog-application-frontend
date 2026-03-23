import api from './api';

const NotificationService = {
  /**
   * Fetch paginated notifications for the current user.
   */
  getNotifications: async (page = 1) => {
    const response = await api.get(`notifications/?page=${page}`);
    return response.data;
  },

  /**
   * Mark a specific notification as read.
   */
  markAsRead: async (id) => {
    const response = await api.post(`notifications/${id}/read/`);
    return response.data;
  },

  /**
   * Mark all notifications as read.
   */
  markAllAsRead: async () => {
    const response = await api.post('notifications/read-all/');
    return response.data;
  },
};

export default NotificationService;
