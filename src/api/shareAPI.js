import api from './index';

export const shareAPI = {
  // Track a share
  trackShare: (postId, platform) => 
    api.post(`/posts/${postId}/share`, { platform }),
    
  // Get share statistics for a post
  getPostShares: (postId) => 
    api.get(`/posts/${postId}/shares`),
    
  // Get overall share statistics
  getShareStats: (params = {}) => 
    api.get('/stats/shares', { params }),
};

export default shareAPI;