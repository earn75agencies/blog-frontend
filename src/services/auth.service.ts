import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { AuthResponse, User, ApiResponse } from '../types';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER(),
      data
    );
    return response.data!;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN(),
      data
    );
    
    // Verify response status
    if (response.status !== 'success' || !response.data) {
      throw new Error(response.message || 'Login failed');
    }
    
    // Extract the nested data field from the API response
    return response.data;
  }

  async logout(): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.LOGOUT());
  }

  async getMe(): Promise<User> {
    const response = await apiService.get<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.AUTH.ME()
    );
    return response.data!.user;
  }

  async updatePassword(data: UpdatePasswordData): Promise<{ token: string }> {
    const response = await apiService.put<ApiResponse<{ token: string }>>(
      API_ENDPOINTS.AUTH.UPDATE_PASSWORD(),
      data
    );
    return response.data!;
  }

  async forgotPassword(email: string): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD(), { email });
  }

  async resetPassword(token: string, password: string): Promise<{ token: string }> {
    const response = await apiService.post<ApiResponse<{ token: string }>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD(),
      { token, password }
    );
    return response.data!;
  }

  async verifyEmail(token: string): Promise<void> {
    await apiService.get(API_ENDPOINTS.AUTH.VERIFY_EMAIL(token));
  }

  async resendVerificationEmail(email: string): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION(), { email });
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await apiService.post<ApiResponse<{ token: string }>>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN(),
      { refreshToken }
    );
    return response.data!;
  }
}

export const authService = new AuthService();
export default authService;

