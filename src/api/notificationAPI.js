import api from './index';

export const notificationAPI = {
  // Get all notifications
  getNotifications: (params = {}) => api.get('/notifications', { params }),
  
  // Get notification by ID
  getNotification: (id) => api.get(`/notifications/${id}`),
  
  // Mark notification as read
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  
  // Mark all notifications as read
  markAllAsRead: () => api.put('/notifications/read-all'),
  
  // Delete notification
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  
  // Get unread count
  getUnreadCount: () => api.get('/notifications/unread-count'),
  
  // Get notification settings
  getSettings: () => api.get('/notifications/settings'),
  
  // Update notification settings
  updateSettings: (settings) => api.put('/notifications/settings', settings),
  
  // Subscribe to push notifications
  subscribeToPush: (subscriptionData) => 
    api.post('/notifications/subscribe', subscriptionData),
  
  // Unsubscribe from push notifications
  unsubscribeFromPush: () => api.delete('/notifications/unsubscribe'),
};

export default notificationAPI;