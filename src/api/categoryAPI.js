import api from './index';

export const categoryAPI = {
  // Get all categories
  getCategories: (params = {}) => api.get('/categories', { params }),
  
  // Get category by ID or slug
  getCategory: (id) => api.get(`/categories/${id}`),
  
  // Create category
  createCategory: (categoryData) => api.post('/categories', categoryData),
  
  // Update category
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  
  // Delete category
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  
  // Get posts in category
  getCategoryPosts: (categoryId, params = {}) => 
    api.get(`/categories/${categoryId}/posts`, { params }),
  
  // Get featured categories
  getFeaturedCategories: () => api.get('/categories/featured'),
  
  // Get popular categories
  getPopularCategories: () => api.get('/categories/popular'),
};

export default categoryAPI;