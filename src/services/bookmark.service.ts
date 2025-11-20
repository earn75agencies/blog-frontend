import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse, Post } from '../types';

interface Bookmark {
  _id: string;
  post: Post;
  folder: string;
  notes?: string;
  createdAt: string;
}

interface BookmarksResponse {
  bookmarks: Bookmark[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class BookmarkService {
  async getBookmarks(page: number = 1, limit: number = 20, folder?: string): Promise<ApiResponse<BookmarksResponse>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (folder) queryParams.append('folder', folder);

    const response = await apiService.get<ApiResponse<BookmarksResponse>>(
      `${API_ENDPOINTS.BOOKMARKS.LIST()}?${queryParams.toString()}`
    );
    return response;
  }

  async addBookmark(postId: string, folder?: string, notes?: string): Promise<ApiResponse<{ bookmark: Bookmark }>> {
    const response = await apiService.post<ApiResponse<{ bookmark: Bookmark }>>(
      `${API_ENDPOINTS.BOOKMARKS.ADD()}/${postId}`,
      { folder, notes }
    );
    return response;
  }

  async removeBookmark(postId: string): Promise<ApiResponse<void>> {
    const response = await apiService.delete<ApiResponse<void>>(
      API_ENDPOINTS.BOOKMARKS.REMOVE(postId)
    );
    return response;
  }

  async updateBookmark(postId: string, updates: { folder?: string; notes?: string }): Promise<ApiResponse<{ bookmark: Bookmark }>> {
    const response = await apiService.put<ApiResponse<{ bookmark: Bookmark }>>(
      API_ENDPOINTS.BOOKMARKS.UPDATE(postId),
      updates
    );
    return response;
  }

  async checkBookmark(postId: string): Promise<ApiResponse<{ isBookmarked: boolean; bookmark: Bookmark | null }>> {
    const response = await apiService.get<ApiResponse<{ isBookmarked: boolean; bookmark: Bookmark | null }>>(
      API_ENDPOINTS.BOOKMARKS.CHECK(postId)
    );
    return response;
  }

  async getFolders(): Promise<ApiResponse<{ folders: string[] }>> {
    const response = await apiService.get<ApiResponse<{ folders: string[] }>>(
      API_ENDPOINTS.BOOKMARKS.FOLDERS()
    );
    return response;
  }
}

export const bookmarkService = new BookmarkService();
export default bookmarkService;

