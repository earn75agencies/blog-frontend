import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse } from '../types';

export interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  description?: string;
  stripePriceId?: string;
  stripeProductId?: string;
}

export interface Subscription {
  _id: string;
  user: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethod?: string;
}

export interface CreateSubscriptionData {
  planId: string;
  paymentMethodId?: string;
  autoRenew?: boolean;
}

class SubscriptionService {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiService.get<ApiResponse<{ plans: SubscriptionPlan[] }>>(
      `${API_ENDPOINTS.PAYMENTS?.LIST() || '/api/payments'}/plans`
    );
    return response.data!.plans;
  }

  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const response = await apiService.get<ApiResponse<{ subscription: Subscription }>>(
        `${API_ENDPOINTS.PAYMENTS?.LIST() || '/api/payments'}/subscription/current`
      );
      return response.data!.subscription;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async subscribe(data: CreateSubscriptionData): Promise<Subscription> {
    const response = await apiService.post<ApiResponse<{ subscription: Subscription }>>(
      `${API_ENDPOINTS.PAYMENTS?.LIST() || '/api/payments'}/subscription`,
      data
    );
    return response.data!.subscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await apiService.post(
      `${API_ENDPOINTS.PAYMENTS?.LIST() || '/api/payments'}/subscription/${subscriptionId}/cancel`
    );
  }

  async updateSubscription(subscriptionId: string, data: Partial<CreateSubscriptionData>): Promise<Subscription> {
    const response = await apiService.put<ApiResponse<{ subscription: Subscription }>>(
      `${API_ENDPOINTS.PAYMENTS?.LIST() || '/api/payments'}/subscription/${subscriptionId}`,
      data
    );
    return response.data!.subscription;
  }

  async getSubscriptionHistory(): Promise<Subscription[]> {
    const response = await apiService.get<ApiResponse<{ subscriptions: Subscription[] }>>(
      `${API_ENDPOINTS.PAYMENTS?.LIST() || '/api/payments'}/subscription/history`
    );
    return response.data!.subscriptions;
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;

