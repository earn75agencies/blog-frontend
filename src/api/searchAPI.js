import api from './index';

export const searchAPI = {
  // Global search
  search: (query, params = {}) => 
    api.get('/search', { params: { q: query, ...params } }),
  
  // Search posts
  searchPosts: (query, params = {}) => 
    api.get('/search/posts', { params: { q: query, ...params } }),
  
  // Search users
  searchUsers: (query, params = {}) => 
    api.get('/search/users', { params: { q: query, ...params } }),
  
  // Search tags
  searchTags: (query, params = {}) => 
    api.get('/search/tags', { params: { q: query, ...params } }),
  
  // Search categories
  searchCategories: (query, params = {}) => 
    api.get('/search/categories', { params: { q: query, ...params } }),
  
  // Get search suggestions
  getSuggestions: (query) => 
    api.get('/search/suggestions', { params: { q: query } }),
  
  // Get trending searches
  getTrendingSearches: () => api.get('/search/trending'),
  
  // Get search history
  getSearchHistory: () => api.get('/search/history'),
  
  // Clear search history
  clearSearchHistory: () => api.delete('/search/history'),
  
  // Advanced search with filters
  advancedSearch: (searchData) => 
    api.post('/search/advanced', searchData),
};

export default searchAPI;