import api from './index';

export const postAPI = {
  // Get all posts with optional filters
  getPosts: (params = {}) => api.get('/posts', { params }),
  
  // Get a single post by ID or slug
  getPost: (id) => api.get(`/posts/${id}`),
  
  // Create a new post
  createPost: (postData) => api.post('/posts', postData),
  
  // Update a post
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  
  // Delete a post
  deletePost: (id) => api.delete(`/posts/${id}`),
  
  // Like/unlike a post
  toggleLike: (id) => api.post(`/posts/${id}/like`),
  
  // Get post shares
  getPostShares: (id) => api.get(`/posts/${id}/shares`),
  
  // Track a share
  trackShare: (id, platform) => api.post(`/posts/${id}/share`, { platform }),
  
  // Get posts by category
  getPostsByCategory: (category, params = {}) => 
    api.get(`/posts/category/${category}`, { params }),
  
  // Get posts by author
  getPostsByAuthor: (authorId, params = {}) => 
    api.get(`/posts/author/${authorId}`, { params }),
    
  // Get featured posts
  getFeaturedPosts: (params = {}) => 
    api.get('/posts/featured', { params }),
    
  // Get trending posts
  getTrendingPosts: (params = {}) => 
    api.get('/posts/trending', { params }),
    
  // Get most liked posts
  getMostLiked: (params = {}) => 
    api.get('/posts/most-liked', { params }),
    
  // Get most shared posts
  getMostShared: (params = {}) => 
    api.get('/posts/most-shared', { params }),
    
  // Get user's liked posts
  getLikedPosts: (params = {}) => 
    api.get('/posts/liked/me', { params }),
    
  // Add comment to post
  addComment: (postId, commentData) => 
    api.post(`/posts/${postId}/comments`, commentData),
    
  // Delete comment
  deleteComment: (postId, commentId) => 
    api.delete(`/posts/${postId}/comments/${commentId}`),
};

export default postAPI;