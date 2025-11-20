import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse, Pagination } from '../types';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  virtualLocation?: string;
  attendees: number;
  maxAttendees?: number;
  image?: string;
  category: string;
  tags?: string[];
  organizer: string | {
    _id: string;
    username: string;
    avatar?: string;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isRegistered?: boolean;
  registrationRequired: boolean;
  price?: number;
  currency?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  virtualLocation?: string;
  maxAttendees?: number;
  category: string;
  tags?: string[];
  registrationRequired: boolean;
  price?: number;
  currency?: string;
}

class EventService {
  async getEvents(params?: {
    filter?: 'upcoming' | 'past' | 'all';
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<{ events: Event[]; pagination: Pagination }> {
    const queryParams = new URLSearchParams();
    if (params?.filter) queryParams.append('filter', params.filter);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);

    const response = await apiService.get<ApiResponse<{ events: Event[]; pagination: Pagination }>>(
      `${API_ENDPOINTS.EVENTS.LIST()}?${queryParams.toString()}`
    );
    return {
      events: response.data!.events,
      pagination: response.pagination!,
    };
  }

  async getEvent(id: string): Promise<Event> {
    const response = await apiService.get<ApiResponse<{ event: Event }>>(
      API_ENDPOINTS.EVENTS.GET(id)
    );
    return response.data!.event;
  }

  async createEvent(data: CreateEventData): Promise<Event> {
    const response = await apiService.post<ApiResponse<{ event: Event }>>(
      API_ENDPOINTS.EVENTS.CREATE(),
      data
    );
    return response.data!.event;
  }

  async updateEvent(id: string, data: Partial<CreateEventData>): Promise<Event> {
    const response = await apiService.put<ApiResponse<{ event: Event }>>(
      API_ENDPOINTS.EVENTS.UPDATE(id),
      data
    );
    return response.data!.event;
  }

  async deleteEvent(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.EVENTS.DELETE(id));
  }

  async registerForEvent(id: string): Promise<void> {
    await apiService.post(API_ENDPOINTS.EVENTS.REGISTER(id));
  }

  async cancelRegistration(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.EVENTS.CANCEL_REGISTRATION(id));
  }
}

export const eventService = new EventService();
export default eventService;

