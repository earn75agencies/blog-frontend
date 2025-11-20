import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse, Notification } from '../types';

class NotificationService {
  async getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false) {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (unreadOnly) queryParams.append('unread', 'true');

    const response = await apiService.get<ApiResponse<{ notifications: Notification[]; unreadCount: number; pagination: any }>>(
      `${API_ENDPOINTS.NOTIFICATIONS.LIST()}?${queryParams.toString()}`
    );
    return response.data!;
  }

  async markAsRead(notificationId: string) {
    await apiService.put(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
    );
  }

  async markAllAsRead() {
    await apiService.put(
      API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ()
    );
  }

  async deleteNotification(notificationId: string) {
    await apiService.delete(
      API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId)
    );
  }

  async getUnreadCount() {
    const response = await apiService.get<ApiResponse<{ count: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT()
    );
    return response.data!.count;
  }
}

export const notificationService = new NotificationService();
export default notificationService;

