import api from './api.service';

export interface Note {
  _id: string;
  user: string;
  post: string | {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
  };
  content: string;
  highlightedText?: string;
  type: 'note' | 'highlight' | 'annotation' | 'bookmark' | 'reminder';
  color?: string;
  tags?: string[];
  isPrivate: boolean;
  isPinned: boolean;
  position?: {
    paragraphIndex?: number;
    charIndex?: number;
  };
  contentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  content: string;
  highlightedText?: string;
  type?: Note['type'];
  color?: string;
  tags?: string[];
  contentReference?: string;
  position?: {
    paragraphIndex?: number;
    charIndex?: number;
  };
  isPrivate?: boolean;
}

export interface UpdateNoteData extends Partial<CreateNoteData> {
  isPinned?: boolean;
}

export interface NoteStats {
  total: number;
  byType: Record<string, number>;
  topPosts: Array<{
    post: {
      title: string;
      slug: string;
    };
    count: number;
  }>;
}

const noteService = {
  /**
   * Get notes for a specific post
   */
  getPostNotes: async (postId: string): Promise<Note[]> => {
    const response = await api.get(`/notes/post/${postId}`);
    return response.data.data.notes;
  },

  /**
   * Get all user notes
   */
  getUserNotes: async (params?: {
    type?: Note['type'];
    tags?: string[];
    postId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ notes: Note[]; pagination: any }> => {
    const response = await api.get('/notes', { params });
    return response.data.data;
  },

  /**
   * Get single note
   */
  getNote: async (noteId: string): Promise<Note> => {
    const response = await api.get(`/notes/${noteId}`);
    return response.data.data.note;
  },

  /**
   * Create note for a post
   */
  createNote: async (postId: string, data: CreateNoteData): Promise<Note> => {
    const response = await api.post(`/notes/post/${postId}`, data);
    return response.data.data.note;
  },

  /**
   * Update note
   */
  updateNote: async (noteId: string, data: UpdateNoteData): Promise<Note> => {
    const response = await api.put(`/notes/${noteId}`, data);
    return response.data.data.note;
  },

  /**
   * Delete note
   */
  deleteNote: async (noteId: string): Promise<void> => {
    await api.delete(`/notes/${noteId}`);
  },

  /**
   * Toggle note pin
   */
  togglePin: async (noteId: string): Promise<{ note: Note; isPinned: boolean }> => {
    const response = await api.patch(`/notes/${noteId}/pin`);
    return response.data.data;
  },

  /**
   * Search notes
   */
  searchNotes: async (query: string): Promise<Note[]> => {
    const response = await api.get('/notes/search', { params: { q: query } });
    return response.data.data.notes;
  },

  /**
   * Get note statistics
   */
  getNoteStats: async (): Promise<NoteStats> => {
    const response = await api.get('/notes/stats');
    return response.data.data;
  },
};

export default noteService;



