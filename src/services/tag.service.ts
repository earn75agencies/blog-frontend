import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Tag, Post, ApiResponse, Pagination, QueryParams } from '../types';

class TagService {
  async getTags(page: number = 1, limit: number = 50): Promise<{ tags: Tag[]; pagination: Pagination }> {
    const response = await apiService.get<ApiResponse<{ tags: Tag[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.TAGS.LIST()}?page=${page}&limit=${limit}`
    );
    return {
      tags: response.data!.tags,
      pagination: response.pagination!,
    };
  }

  async getPopularTags(limit: number = 20): Promise<Tag[]> {
    const response = await apiService.get<ApiResponse<{ tags: Tag[] }>>(
      `${API_ENDPOINTS.TAGS.POPULAR()}?limit=${limit}`
    );
    return response.data!.tags;
  }

  async getTag(slug: string): Promise<Tag> {
    const response = await apiService.get<ApiResponse<{ tag: Tag }>>(
      API_ENDPOINTS.TAGS.GET(slug)
    );
    return response.data!.tag;
  }

  async getTagPosts(tagId: string, params?: QueryParams): Promise<{ posts: Post[]; pagination: Pagination }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiService.get<ApiResponse<{ posts: Post[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.TAGS.POSTS(tagId)}?${queryParams.toString()}`
    );
    return {
      posts: response.data!.posts,
      pagination: response.pagination!,
    };
  }
}

export const tagService = new TagService();
export default tagService;

