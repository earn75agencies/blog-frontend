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
    
  // Get comment replies
  getReplies: (commentId, params = {}) => 
    api.get(`/comments/${commentId}/replies`, { params }),
    
  // Reply to comment
  replyToComment: (commentId, replyData) => 
    api.post(`/comments/${commentId}/reply`, replyData),
    
  // Report comment
  reportComment: (postId, commentId, reason) => 
    api.post(`/posts/${postId}/comments/${commentId}/report`, { reason }),
    
  // Get user comments
  getUserComments: (userId, params = {}) => 
    api.get(`/comments/user/${userId}`, { params }),
};

export default commentAPI;