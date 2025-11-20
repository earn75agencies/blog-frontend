import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Post, ApiResponse, Pagination, QueryParams } from '../types';

export interface CreatePostData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isFeatured?: boolean;
  allowComments?: boolean;
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface PostsResponse {
  posts: Post[];
  pagination: Pagination;
}

class PostService {
  async getPosts(params?: QueryParams): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.tags) {
      params.tags.forEach((tag) => queryParams.append('tags', tag));
    }
    if (params?.author) queryParams.append('author', params.author);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiService.get<ApiResponse<{ posts: Post[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.POSTS.LIST()}?${queryParams.toString()}`
    );
    return {
      posts: response.data!.posts,
      pagination: response.pagination!,
    };
  }

  async getPost(slug: string): Promise<Post> {
    const response = await apiService.get<ApiResponse<{ post: Post }>>(
      API_ENDPOINTS.POSTS.GET(slug)
    );
    return response.data!.post;
  }

  async createPost(data: CreatePostData, file?: File): Promise<Post> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    if (file) {
      formData.append('featuredImage', file);
    }

    const response = await apiService.post<ApiResponse<{ post: Post }>>(
      API_ENDPOINTS.POSTS.CREATE(),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data!.post;
  }

  async updatePost(id: string, data: UpdatePostData, file?: File): Promise<Post> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    if (file) {
      formData.append('featuredImage', file);
    }

    const response = await apiService.put<ApiResponse<{ post: Post }>>(
      API_ENDPOINTS.POSTS.UPDATE(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data!.post;
  }

  async deletePost(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.POSTS.DELETE(id));
  }

  async likePost(id: string): Promise<number> {
    const response = await apiService.post<ApiResponse<{ likes: number }>>(
      API_ENDPOINTS.POSTS.LIKE(id)
    );
    return response.data!.likes;
  }

  async unlikePost(id: string): Promise<number> {
    const response = await apiService.post<ApiResponse<{ likes: number }>>(
      API_ENDPOINTS.POSTS.UNLIKE(id)
    );
    return response.data!.likes;
  }

  async getFeaturedPosts(limit: number = 5): Promise<Post[]> {
    const response = await apiService.get<ApiResponse<{ posts: Post[] }>>(
      `${API_ENDPOINTS.POSTS.FEATURED()}?limit=${limit}`
    );
    return response.data!.posts;
  }

  async getPostsByCategory(categoryId: string, params?: QueryParams): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiService.get<ApiResponse<{ posts: Post[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.POSTS.BY_CATEGORY(categoryId)}?${queryParams.toString()}`
    );
    return {
      posts: response.data!.posts,
      pagination: response.pagination!,
    };
  }

  async getPostsByTag(tagId: string, params?: QueryParams): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiService.get<ApiResponse<{ posts: Post[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.POSTS.BY_TAG(tagId)}?${queryParams.toString()}`
    );
    return {
      posts: response.data!.posts,
      pagination: response.pagination!,
    };
  }

  async getPostsByAuthor(authorId: string, params?: QueryParams): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiService.get<ApiResponse<{ posts: Post[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.POSTS.BY_AUTHOR(authorId)}?${queryParams.toString()}`
    );
    return {
      posts: response.data!.posts,
      pagination: response.pagination!,
    };
  }

  async searchPosts(query: string, params?: QueryParams): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiService.get<ApiResponse<{ posts: Post[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.POSTS.SEARCH()}?${queryParams.toString()}`
    );
    return {
      posts: response.data!.posts,
      pagination: response.pagination!,
    };
  }

  async getRelatedPosts(id: string, limit: number = 5): Promise<Post[]> {
    const response = await apiService.get<ApiResponse<{ posts: Post[] }>>(
      `${API_ENDPOINTS.POSTS.RELATED(id)}?limit=${limit}`
    );
    return response.data!.posts;
  }
}

export const postService = new PostService();
export default postService;

