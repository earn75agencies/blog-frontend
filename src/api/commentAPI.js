import api from './index';

export const commentAPI = {
  // Get comments for a post
  getComments: (postId, params = {}) => 
    api.get(`/posts/${postId}/comments`, { params }),
  
  // Add comment to post
  addComment: (postId, commentData) => 
    api.post(`/posts/${postId}/comments`, commentData),
    
  // Update comment
  updateComment: (postId, commentId, commentData) => 
    api.put(`/posts/${postId}/comments/${commentId}`, commentData),
    
  // Delete comment
  deleteComment: (postId, commentId) => 
    api.delete(`/posts/${postId}/comments/${commentId}`),
    
  // Like/unlike comment
  toggleLikeComment: (postId, commentId) => 
    api.post(`/posts/${postId}/comments/${commentId}/like`),
};

export default commentAPI;