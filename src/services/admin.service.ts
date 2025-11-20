import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse, User, Post, Settings } from '../types';

class AdminService {
  async getOverview() {
    const response = await apiService.get<ApiResponse<any>>(
      API_ENDPOINTS.ADMIN.OVERVIEW()
    );
    return response.data!;
  }

  async getAllUsers(page: number = 1, limit: number = 20, search?: string) {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (search) queryParams.append('search', search);

    const response = await apiService.get<ApiResponse<{ users: User[]; pagination: any }>>(
      `${API_ENDPOINTS.ADMIN.USERS()}?${queryParams.toString()}`
    );
    return response.data!;
  }

  async updateUserRole(userId: string, role: string) {
    const response = await apiService.put<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.ADMIN.UPDATE_USER_ROLE(userId),
      { role }
    );
    return response.data!.user;
  }

  async getAllPosts(page: number = 1, limit: number = 20, status?: string) {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (status) queryParams.append('status', status);

    const response = await apiService.get<ApiResponse<{ posts: Post[]; pagination: any }>>(
      `${API_ENDPOINTS.ADMIN.POSTS()}?${queryParams.toString()}`
    );
    return response.data!;
  }

  async approveComment(commentId: string) {
    const response = await apiService.put<ApiResponse<{ comment: any }>>(
      API_ENDPOINTS.ADMIN.APPROVE_COMMENT(commentId)
    );
    return response.data!.comment;
  }

  async rejectComment(commentId: string) {
    await apiService.put(
      API_ENDPOINTS.ADMIN.REJECT_COMMENT(commentId)
    );
  }

  async getSettings() {
    const response = await apiService.get<ApiResponse<{ settings: Settings }>>(
      API_ENDPOINTS.ADMIN.SETTINGS()
    );
    return response.data!.settings;
  }

  async updateSettings(settings: Partial<Settings>) {
    const response = await apiService.put<ApiResponse<{ settings: Settings }>>(
      API_ENDPOINTS.ADMIN.SETTINGS(),
      settings
    );
    return response.data!.settings;
  }
}

export const adminService = new AdminService();
export default adminService;

