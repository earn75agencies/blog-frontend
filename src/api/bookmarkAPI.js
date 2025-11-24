import api from './index';

export const bookmarkAPI = {
  // Get all bookmarks
  getBookmarks: (params = {}) => api.get('/bookmarks', { params }),
  
  // Get bookmark by ID
  getBookmark: (id) => api.get(`/bookmarks/${id}`),
  
  // Create bookmark
  createBookmark: (bookmarkData) => api.post('/bookmarks', bookmarkData),
  
  // Delete bookmark
  deleteBookmark: (id) => api.delete(`/bookmarks/${id}`),
  
  // Toggle bookmark (add/remove)
  toggleBookmark: (postId) => api.post(`/posts/${postId}/bookmark`),
  
  // Get bookmarked posts
  getBookmarkedPosts: (params = {}) => api.get('/bookmarks/posts', { params }),
  
  // Get bookmark collections
  getCollections: () => api.get('/bookmarks/collections'),
  
  // Create collection
  createCollection: (collectionData) => 
    api.post('/bookmarks/collections', collectionData),
  
  // Update collection
  updateCollection: (id, collectionData) => 
    api.put(`/bookmarks/collections/${id}`, collectionData),
  
  // Delete collection
  deleteCollection: (id) => api.delete(`/bookmarks/collections/${id}`),
  
  // Add bookmark to collection
  addToCollection: (bookmarkId, collectionId) => 
    api.post(`/bookmarks/${bookmarkId}/collections/${collectionId}`),
  
  // Remove bookmark from collection
  removeFromCollection: (bookmarkId, collectionId) => 
    api.delete(`/bookmarks/${bookmarkId}/collections/${collectionId}`),
};

export default bookmarkAPI;