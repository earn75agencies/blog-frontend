import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { User, Post, ApiResponse, Pagination, QueryParams } from '../types';

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

class UserService {
  async getUsers(params?: QueryParams): Promise<{ users: User[]; pagination: Pagination }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await apiService.get<ApiResponse<{ users: User[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.USERS.LIST()}?${queryParams.toString()}`
    );
    return {
      users: response.data!.users,
      pagination: response.pagination!,
    };
  }

  async getUser(id: string): Promise<User> {
    const response = await apiService.get<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.USERS.GET(id)
    );
    return response.data!.user;
  }

  async getUserProfile(username: string): Promise<User> {
    const response = await apiService.get<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.USERS.PROFILE(username)
    );
    return response.data!.user;
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await apiService.put<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.USERS.UPDATE(id),
      data
    );
    return response.data!.user;
  }

  async followUser(id: string): Promise<void> {
    await apiService.post(API_ENDPOINTS.USERS.FOLLOW(id));
  }

  async unfollowUser(id: string): Promise<void> {
    await apiService.post(API_ENDPOINTS.USERS.UNFOLLOW(id));
  }

  async getUserFollowers(id: string): Promise<User[]> {
    const response = await apiService.get<ApiResponse<{ followers: User[] }>>(
      API_ENDPOINTS.USERS.FOLLOWERS(id)
    );
    return response.data!.followers;
  }

  async getUserFollowing(id: string): Promise<User[]> {
    const response = await apiService.get<ApiResponse<{ following: User[] }>>(
      API_ENDPOINTS.USERS.FOLLOWING(id)
    );
    return response.data!.following;
  }

  async getUserPosts(id: string, params?: QueryParams): Promise<{ posts: Post[]; pagination: Pagination }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const response = await apiService.get<ApiResponse<{ posts: Post[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.USERS.POSTS(id)}?${queryParams.toString()}`
    );
    return {
      posts: response.data!.posts,
      pagination: response.pagination!,
    };
  }
}

export const userService = new UserService();
export default userService;

