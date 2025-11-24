import api from './index';

export const analyticsAPI = {
  // Get analytics overview
  getOverview: (params = {}) => api.get('/analytics/overview', { params }),
  
  // Get page views analytics
  getPageViews: (params = {}) => api.get('/analytics/page-views', { params }),
  
  // Get user analytics
  getUserAnalytics: (params = {}) => api.get('/analytics/users', { params }),
  
  // Get post analytics
  getPostAnalytics: (postId, params = {}) => 
    api.get(`/analytics/posts/${postId}`, { params }),
  
  // Get traffic sources
  getTrafficSources: (params = {}) => api.get('/analytics/traffic-sources', { params }),
  
  // Get device analytics
  getDeviceAnalytics: (params = {}) => api.get('/analytics/devices', { params }),
  
  // Get location analytics
  getLocationAnalytics: (params = {}) => api.get('/analytics/locations', { params }),
  
  // Get engagement metrics
  getEngagementMetrics: (params = {}) => api.get('/analytics/engagement', { params }),
  
  // Get real-time stats
  getRealTimeStats: () => api.get('/analytics/realtime'),
  
  // Export analytics data
  exportData: (params = {}) => api.get('/analytics/export', { params }),
};

export default analyticsAPI;