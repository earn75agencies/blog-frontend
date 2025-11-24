import api from './index';

export const mediaAPI = {
  // Upload file
  uploadFile: (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Upload multiple files
  uploadMultiple: (files, options = {}) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });
    return api.post('/media/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Get media library
  getMediaLibrary: (params = {}) => api.get('/media', { params }),
  
  // Get media by ID
  getMedia: (id) => api.get(`/media/${id}`),
  
  // Update media metadata
  updateMedia: (id, metadata) => api.put(`/media/${id}`, metadata),
  
  // Delete media
  deleteMedia: (id) => api.delete(`/media/${id}`),
  
  // Get media stats
  getMediaStats: () => api.get('/media/stats'),
  
  // Optimize image
  optimizeImage: (id, options = {}) => 
    api.post(`/media/${id}/optimize`, options),
  
  // Resize image
  resizeImage: (id, width, height) => 
    api.post(`/media/${id}/resize`, { width, height }),
  
  // Generate thumbnails
  generateThumbnails: (id, sizes = []) => 
    api.post(`/media/${id}/thumbnails`, { sizes }),
  
  // Get media by type
  getMediaByType: (type, params = {}) => 
    api.get(`/media/type/${type}`, { params }),
  
  // Search media
  searchMedia: (query, params = {}) => 
    api.get('/media/search', { params: { q: query, ...params } }),
};

export default mediaAPI;