import api from './index';

export const noteAPI = {
  // Get all notes
  getNotes: (params = {}) => api.get('/notes', { params }),
  
  // Get note by ID
  getNote: (id) => api.get(`/notes/${id}`),
  
  // Create note
  createNote: (noteData) => api.post('/notes', noteData),
  
  // Update note
  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),
  
  // Delete note
  deleteNote: (id) => api.delete(`/notes/${id}`),
  
  // Get notes by category
  getNotesByCategory: (categoryId, params = {}) => 
    api.get(`/notes/category/${categoryId}`, { params }),
  
  // Search notes
  searchNotes: (query, params = {}) => 
    api.get('/notes/search', { params: { q: query, ...params } }),
  
  // Get pinned notes
  getPinnedNotes: () => api.get('/notes/pinned'),
  
  // Pin/unpin note
  pinNote: (id) => api.post(`/notes/${id}/pin`),
  unpinNote: (id) => api.delete(`/notes/${id}/pin`),
  
  // Archive note
  archiveNote: (id) => api.post(`/notes/${id}/archive`),
  
  // Get archived notes
  getArchivedNotes: () => api.get('/notes/archived'),
  
  // Restore archived note
  restoreNote: (id) => api.post(`/notes/${id}/restore`),
  
  // Share note
  shareNote: (id, options = {}) => 
    api.post(`/notes/${id}/share`, options),
  
  // Get shared notes
  getSharedNotes: () => api.get('/notes/shared'),
  
  // Duplicate note
  duplicateNote: (id) => api.post(`/notes/${id}/duplicate`),
  
  // Export note
  exportNote: (id, format = 'markdown') => 
    api.get(`/notes/${id}/export`, { params: { format } }),
  
  // Import notes
  importNotes: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/notes/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default noteAPI;