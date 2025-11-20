import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Comment, ApiResponse, Pagination } from '../types';

export interface CreateCommentData {
  content: string;
  post: string;
  parentComment?: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination?: Pagination;
}

class CommentService {
  async getComments(postId: string, page: number = 1, limit: number = 20): Promise<CommentsResponse> {
    const response = await apiService.get<ApiResponse<{ comments: Comment[]; pagination?: Pagination }>>(
      `${API_ENDPOINTS.COMMENTS.BY_POST(postId)}?page=${page}&limit=${limit}`
    );
    return {
      comments: response.data!.comments,
      pagination: response.pagination,
    };
  }

  async getComment(id: string): Promise<Comment> {
    const response = await apiService.get<ApiResponse<{ comment: Comment }>>(
      API_ENDPOINTS.COMMENTS.GET(id)
    );
    return response.data!.comment;
  }

  async createComment(data: CreateCommentData): Promise<Comment> {
    const response = await apiService.post<ApiResponse<{ comment: Comment }>>(
      API_ENDPOINTS.COMMENTS.CREATE(),
      data
    );
    return response.data!.comment;
  }

  async updateComment(id: string, data: UpdateCommentData): Promise<Comment> {
    const response = await apiService.put<ApiResponse<{ comment: Comment }>>(
      API_ENDPOINTS.COMMENTS.UPDATE(id),
      data
    );
    return response.data!.comment;
  }

  async deleteComment(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.COMMENTS.DELETE(id));
  }

  async likeComment(id: string): Promise<number> {
    const response = await apiService.post<ApiResponse<{ likes: number }>>(
      API_ENDPOINTS.COMMENTS.LIKE(id)
    );
    return response.data!.likes;
  }

  async unlikeComment(id: string): Promise<number> {
    const response = await apiService.post<ApiResponse<{ likes: number }>>(
      API_ENDPOINTS.COMMENTS.UNLIKE(id)
    );
    return response.data!.likes;
  }

  async getCommentReplies(id: string): Promise<Comment[]> {
    const response = await apiService.get<ApiResponse<{ replies: Comment[] }>>(
      API_ENDPOINTS.COMMENTS.REPLIES(id)
    );
    return response.data!.replies;
  }
}

export const commentService = new CommentService();
export default commentService;

