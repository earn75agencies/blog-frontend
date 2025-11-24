import api from './index';

export const userAPI = {
  // Get all users
  getUsers: (params = {}) => api.get('/users', { params }),
  
  // Get user by ID
  getUser: (id) => api.get(`/users/${id}`),
  
  // Get user profile by username
  getUserProfile: (username) => api.get(`/users/profile/${username}`),
  
  // Update user
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Delete user
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Follow/unfollow user
  followUser: (id) => api.post(`/users/${id}/follow`),
  unfollowUser: (id) => api.post(`/users/${id}/unfollow`),
  
  // Get user followers
  getUserFollowers: (id) => api.get(`/users/${id}/followers`),
  
  // Get user following
  getUserFollowing: (id) => api.get(`/users/${id}/following`),
  
  // Get user posts
  getUserPosts: (id, params = {}) => api.get(`/users/${id}/posts`, { params }),
  
  // Block/unblock user
  blockUser: (id) => api.post(`/users/${id}/block`),
  unblockUser: (id) => api.post(`/users/${id}/unblock`),
  
  // Mute/unmute user
  muteUser: (id) => api.post(`/users/${id}/mute`),
  unmuteUser: (id) => api.post(`/users/${id}/unmute`),
  
  // Get blocked users
  getBlockedUsers: () => api.get('/users/me/blocked'),
  
  // Get muted users
  getMutedUsers: () => api.get('/users/me/muted'),
  
  // Export user data
  exportUserData: () => api.get('/users/me/export'),
  exportPosts: () => api.get('/users/me/export/posts'),
  exportComments: () => api.get('/users/me/export/comments'),
};

export default userAPI;