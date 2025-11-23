import api from './index';

export const authAPI = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register user
  register: (userData) => api.post('/auth/register', userData),
  
  // Logout user
  logout: () => api.post('/auth/logout'),
  
  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  // Change password
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
  
  // Request password reset
  requestPasswordReset: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, passwordData) => 
    api.post(`/auth/reset-password/${token}`, passwordData),
};

export default authAPI;