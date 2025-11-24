import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse } from '../types';

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  method: string;
  transactionId?: string;
  description: string;
  metadata?: Record<string, any>;
  subscriptionId?: string;
  orderId?: string;
  paymentProvider?: string;
  providerResponse?: Record<string, any>;
  refundedAmount?: number;
  refundedAt?: string;
  user?: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  // Gidix Organization fields
  paymentProcessor?: string;
  paymentRecipient?: string;
  supportContact?: string;
  processedBy?: string;
}

interface PaymentsResponse {
  payments: Payment[];
  currentPage: number;
  totalPages: number;
  totalPayments: number;
  paymentProcessor?: string;
  organizationInfo?: {
    name: string;
    contactEmail: string;
    supportUrl: string;
    paymentPolicy: string;
  };
}

class PaymentService {
  async getPayments(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<ApiResponse<PaymentsResponse>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (status) queryParams.append('status', status);

    const response = await apiService.get<ApiResponse<PaymentsResponse>>(
      `${API_ENDPOINTS.PAYMENTS.LIST()}?${queryParams.toString()}`
    );
    return response;
  }

  async getPayment(id: string): Promise<ApiResponse<{ payment: Payment }>> {
    const response = await apiService.get<ApiResponse<{ payment: Payment }>>(
      API_ENDPOINTS.PAYMENTS.GET(id)
    );
    return response;
  }

  async createPayment(data: Partial<Payment>): Promise<ApiResponse<{ payment: Payment }>> {
    const response = await apiService.post<ApiResponse<{ payment: Payment }>>(
      API_ENDPOINTS.PAYMENTS.CREATE(),
      data
    );
    return response;
  }

  async updatePaymentStatus(
    id: string,
    status: string,
    refundedAmount?: number
  ): Promise<ApiResponse<{ payment: Payment }>> {
    const response = await apiService.put<ApiResponse<{ payment: Payment }>>(
      API_ENDPOINTS.PAYMENTS.UPDATE_STATUS(id),
      { status, refundedAmount }
    );
    return response;
  }
}

export const paymentService = new PaymentService();
export default paymentService;

