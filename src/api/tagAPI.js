import api from './index';

export const tagAPI = {
  // Get all tags
  getTags: (params = {}) => api.get('/tags', { params }),
  
  // Get tag by ID or slug
  getTag: (id) => api.get(`/tags/${id}`),
  
  // Create tag
  createTag: (tagData) => api.post('/tags', tagData),
  
  // Update tag
  updateTag: (id, tagData) => api.put(`/tags/${id}`, tagData),
  
  // Delete tag
  deleteTag: (id) => api.delete(`/tags/${id}`),
  
  // Get posts with tag
  getTagPosts: (tagId, params = {}) => 
    api.get(`/tags/${tagId}/posts`, { params }),
  
  // Get trending tags
  getTrendingTags: () => api.get('/tags/trending'),
  
  // Get popular tags
  getPopularTags: () => api.get('/tags/popular'),
  
  // Search tags
  searchTags: (query) => api.get('/tags/search', { params: { q: query } }),
};

export default tagAPI;