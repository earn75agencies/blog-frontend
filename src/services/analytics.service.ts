import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse } from '../types';

class AnalyticsService {
  async getOverview() {
    const response = await apiService.get<ApiResponse<any>>(
      API_ENDPOINTS.ANALYTICS.OVERVIEW()
    );
    return response.data!;
  }

  async getPostsStats(startDate?: string, endDate?: string) {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    const response = await apiService.get<ApiResponse<any>>(
      `${API_ENDPOINTS.ANALYTICS.POSTS()}?${queryParams.toString()}`
    );
    return response.data!;
  }

  async getUserStats(startDate?: string, endDate?: string) {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    const response = await apiService.get<ApiResponse<any>>(
      `${API_ENDPOINTS.ANALYTICS.USERS()}?${queryParams.toString()}`
    );
    return response.data!;
  }

  async getTrends(days: number = 30) {
    const response = await apiService.get<ApiResponse<any>>(
      `${API_ENDPOINTS.ANALYTICS.TRENDS()}?days=${days}`
    );
    return response.data!;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;

