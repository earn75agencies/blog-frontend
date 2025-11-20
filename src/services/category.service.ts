import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Category, Post, ApiResponse, Pagination, QueryParams } from '../types';

class CategoryService {
  async getCategories(params?: { level?: number; parent?: string; featured?: boolean; limit?: number }): Promise<Category[]> {
    const queryParams = new URLSearchParams();
    if (params?.level !== undefined) queryParams.append('level', params.level.toString());
    if (params?.parent !== undefined) queryParams.append('parent', params.parent);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const response = await apiService.get<ApiResponse<{ categories: Category[] }>>(
      `${API_ENDPOINTS.CATEGORIES.LIST()}?${queryParams.toString()}`
    );
    return response.data!.categories;
  }

  async getCategoryHierarchy(): Promise<Category[]> {
    const response = await apiService.get<ApiResponse<{ categories: Category[] }>>(
      API_ENDPOINTS.CATEGORIES.HIERARCHY()
    );
    return response.data!.categories;
  }

  async getCategory(slug: string): Promise<Category> {
    const response = await apiService.get<ApiResponse<{ category: Category }>>(
      API_ENDPOINTS.CATEGORIES.GET(slug)
    );
    return response.data!.category;
  }

  async getCategoryPosts(categoryId: string, params?: QueryParams): Promise<{ posts: Post[]; pagination: Pagination }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiService.get<ApiResponse<{ posts: Post[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.CATEGORIES.POSTS(categoryId)}?${queryParams.toString()}`
    );
    return {
      posts: response.data!.posts,
      pagination: response.pagination!,
    };
  }
}

export const categoryService = new CategoryService();
export default categoryService;

