import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse, Pagination } from '../types';

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  organizer: {
    id: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
  category: string;
  tags: string[];
  type: 'online' | 'in-person' | 'hybrid';
  format: 'conference' | 'workshop' | 'webinar' | 'meetup' | 'networking' | 'social';
  location?: {
    venue: string;
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  onlineDetails?: {
    platform: string;
    meetingUrl: string;
    meetingId?: string;
    password?: string;
  };
  startDate: string;
  endDate: string;
  timezone: string;
  capacity: number;
  registeredCount: number;
  price: number;
  currency: string;
  isFree: boolean;
  isPublished: boolean;
  registrationDeadline: string;
  requirements: string[];
  agenda: EventAgendaItem[];
  speakers: EventSpeaker[];
  sponsors: EventSponsor[];
  createdAt: string;
  updatedAt: string;
  // Legacy properties for backward compatibility
  date?: Date;
  endDate?: Date;
  attendees?: number;
  maxAttendees?: number;
  image?: string;
  isRegistered?: boolean;
  registrationRequired?: boolean;
}

export interface EventAgendaItem {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  speaker?: EventSpeaker;
  type: 'keynote' | 'session' | 'break' | 'networking' | 'workshop' | 'panel';
  order: number;
}

export interface EventSpeaker {
  id: string;
  eventId: string;
  name: string;
  bio: string;
  avatar?: string;
  company?: string;
  position?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  isKeynote: boolean;
  order: number;
}

export interface EventSponsor {
  id: string;
  eventId: string;
  name: string;
  logo: string;
  website: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
  description?: string;
  order: number;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  event: Event;
  userId: string;
  user: {
    username: string;
    email: string;
    avatar?: string;
  };
  registeredAt: string;
  status: 'registered' | 'confirmed' | 'cancelled' | 'attended' | 'no-show';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  ticketType?: string;
  specialRequests?: string;
  checkedInAt?: string;
  feedback?: EventFeedback;
}

export interface EventFeedback {
  id: string;
  registrationId: string;
  rating: number;
  comment: string;
  suggestions?: string;
  wouldRecommend: boolean;
  submittedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  tags: string[];
  type: 'online' | 'in-person' | 'hybrid';
  format: 'conference' | 'workshop' | 'webinar' | 'meetup' | 'networking' | 'social';
  location?: {
    venue: string;
    address: string;
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  onlineDetails?: {
    platform: string;
    meetingUrl: string;
    meetingId?: string;
    password?: string;
  };
  startDate: string;
  endDate: string;
  timezone: string;
  capacity: number;
  price: number;
  currency: string;
  registrationDeadline: string;
  requirements: string[];
  // Legacy properties for backward compatibility
  date?: Date;
  endDate?: Date;
  location?: string;
  virtualLocation?: string;
  maxAttendees?: number;
  registrationRequired?: boolean;
}

class EventService {
  async getEvents(params?: {
    filter?: 'upcoming' | 'past' | 'all';
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    format?: string;
    location?: string;
    online?: boolean;
    free?: boolean;
    priceRange?: [number, number];
    tags?: string[];
    startDate?: string;
    endDate?: string;
    search?: string;
    sort?: 'newest' | 'oldest' | 'popular' | 'upcoming' | 'price-low' | 'price-high';
  }): Promise<{ events: Event[]; pagination: Pagination }> {
    const queryParams = new URLSearchParams();
    if (params?.filter) queryParams.append('filter', params.filter);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.format) queryParams.append('format', params.format);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.online !== undefined) queryParams.append('online', params.online.toString());
    if (params?.free !== undefined) queryParams.append('free', params.free.toString());
    if (params?.priceRange) {
      queryParams.append('minPrice', params.priceRange[0].toString());
      queryParams.append('maxPrice', params.priceRange[1].toString());
    }
    if (params?.tags) queryParams.append('tags', params.tags.join(','));
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);

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

  async registerForEvent(eventId: string, data?: {
    ticketType?: string;
    specialRequests?: string;
    paymentData?: {
      paymentMethodId: string;
      amount: number;
      currency: string;
    };
  }): Promise<EventRegistration> {
    const response = await apiService.post<ApiResponse<{ registration: EventRegistration }>>(
      API_ENDPOINTS.EVENTS.REGISTER(eventId),
      data
    );
    return response.data!.registration;
  }

  async cancelRegistration(eventId: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.EVENTS.CANCEL_REGISTRATION(eventId));
  }

  async getUserRegistrations(params?: {
    status?: 'registered' | 'confirmed' | 'cancelled' | 'attended' | 'no-show';
    upcoming?: boolean;
    past?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ registrations: EventRegistration[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.upcoming !== undefined) queryParams.append('upcoming', params.upcoming.toString());
    if (params?.past !== undefined) queryParams.append('past', params.past.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await apiService.get<ApiResponse<{ registrations: EventRegistration[]; total: number }>>(
      `${API_ENDPOINTS.EVENTS.GET('')}/registrations?${queryParams.toString()}`
    );
    return response.data!;
  }

  async getEventRegistrations(eventId: string, params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ registrations: EventRegistration[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await apiService.get<ApiResponse<{ registrations: EventRegistration[]; total: number }>>(
      `${API_ENDPOINTS.EVENTS.ATTENDEES(eventId)}?${queryParams.toString()}`
    );
    return response.data!;
  }

  async checkInAttendee(registrationId: string): Promise<EventRegistration> {
    const response = await apiService.post<ApiResponse<{ registration: EventRegistration }>>(
      `${API_ENDPOINTS.EVENTS.GET('')}/registrations/${registrationId}/checkin`
    );
    return response.data!.registration;
  }

  async getEventAgenda(eventId: string): Promise<EventAgendaItem[]> {
    const response = await apiService.get<ApiResponse<{ agenda: EventAgendaItem[] }>>(
      `${API_ENDPOINTS.EVENTS.GET(eventId)}/agenda`
    );
    return response.data!.agenda;
  }

  async createAgendaItem(eventId: string, data: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    speakerId?: string;
    type: 'keynote' | 'session' | 'break' | 'networking' | 'workshop' | 'panel';
    order: number;
  }): Promise<EventAgendaItem> {
    const response = await apiService.post<ApiResponse<{ agendaItem: EventAgendaItem }>>(
      `${API_ENDPOINTS.EVENTS.GET(eventId)}/agenda`,
      data
    );
    return response.data!.agendaItem;
  }

  async updateAgendaItem(agendaItemId: string, data: Partial<EventAgendaItem>): Promise<EventAgendaItem> {
    const response = await apiService.put<ApiResponse<{ agendaItem: EventAgendaItem }>>(
      `${API_ENDPOINTS.EVENTS.GET('')}/agenda/${agendaItemId}`,
      data
    );
    return response.data!.agendaItem;
  }

  async deleteAgendaItem(agendaItemId: string): Promise<void> {
    await apiService.delete(`${API_ENDPOINTS.EVENTS.GET('')}/agenda/${agendaItemId}`);
  }

  async getEventSpeakers(eventId: string): Promise<EventSpeaker[]> {
    const response = await apiService.get<ApiResponse<{ speakers: EventSpeaker[] }>>(
      `${API_ENDPOINTS.EVENTS.GET(eventId)}/speakers`
    );
    return response.data!.speakers;
  }

  async createSpeaker(eventId: string, data: {
    name: string;
    bio: string;
    company?: string;
    position?: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
    isKeynote: boolean;
    order: number;
  }): Promise<EventSpeaker> {
    const response = await apiService.post<ApiResponse<{ speaker: EventSpeaker }>>(
      `${API_ENDPOINTS.EVENTS.GET(eventId)}/speakers`,
      data
    );
    return response.data!.speaker;
  }

  async updateSpeaker(speakerId: string, data: Partial<EventSpeaker>): Promise<EventSpeaker> {
    const response = await apiService.put<ApiResponse<{ speaker: EventSpeaker }>>(
      `${API_ENDPOINTS.EVENTS.GET('')}/speakers/${speakerId}`,
      data
    );
    return response.data!.speaker;
  }

  async deleteSpeaker(speakerId: string): Promise<void> {
    await apiService.delete(`${API_ENDPOINTS.EVENTS.GET('')}/speakers/${speakerId}`);
  }

  async getEventSponsors(eventId: string): Promise<EventSponsor[]> {
    const response = await apiService.get<ApiResponse<{ sponsors: EventSponsor[] }>>(
      `${API_ENDPOINTS.EVENTS.GET(eventId)}/sponsors`
    );
    return response.data!.sponsors;
  }

  async createSponsor(eventId: string, data: {
    name: string;
    website: string;
    tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
    description?: string;
    order: number;
  }): Promise<EventSponsor> {
    const response = await apiService.post<ApiResponse<{ sponsor: EventSponsor }>>(
      `${API_ENDPOINTS.EVENTS.GET(eventId)}/sponsors`,
      data
    );
    return response.data!.sponsor;
  }

  async updateSponsor(sponsorId: string, data: Partial<EventSponsor>): Promise<EventSponsor> {
    const response = await apiService.put<ApiResponse<{ sponsor: EventSponsor }>>(
      `${API_ENDPOINTS.EVENTS.GET('')}/sponsors/${sponsorId}`,
      data
    );
    return response.data!.sponsor;
  }

  async deleteSponsor(sponsorId: string): Promise<void> {
    await apiService.delete(`${API_ENDPOINTS.EVENTS.GET('')}/sponsors/${sponsorId}`);
  }

  async submitEventFeedback(registrationId: string, data: {
    rating: number;
    comment: string;
    suggestions?: string;
    wouldRecommend: boolean;
  }): Promise<EventFeedback> {
    const response = await apiService.post<ApiResponse<{ feedback: EventFeedback }>>(
      `${API_ENDPOINTS.EVENTS.GET('')}/registrations/${registrationId}/feedback`,
      data
    );
    return response.data!.feedback;
  }

  async getEventFeedback(eventId: string): Promise<EventFeedback[]> {
    const response = await apiService.get<ApiResponse<{ feedback: EventFeedback[] }>>(
      `${API_ENDPOINTS.EVENTS.GET(eventId)}/feedback`
    );
    return response.data!.feedback;
  }

  async searchEvents(query: string, params?: {
    category?: string;
    type?: string;
    format?: string;
    location?: string;
    online?: boolean;
    free?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ events: Event[]; total: number }> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.format) queryParams.append('format', params.format);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.online !== undefined) queryParams.append('online', params.online.toString());
    if (params?.free !== undefined) queryParams.append('free', params.free.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await apiService.get<ApiResponse<{ events: Event[]; total: number }>>(
      `${API_ENDPOINTS.EVENTS.GET('')}/search?${queryParams.toString()}`
    );
    return response.data!;
  }

  async getTrendingEvents(limit: number = 10): Promise<Event[]> {
    const response = await apiService.get<ApiResponse<{ events: Event[] }>>(
      `${API_ENDPOINTS.EVENTS.GET('')}/trending?limit=${limit}`
    );
    return response.data!.events;
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    const response = await apiService.get<ApiResponse<{ events: Event[] }>>(
      `${API_ENDPOINTS.EVENTS.GET('')}/upcoming?limit=${limit}`
    );
    return response.data!.events;
  }

  async getCategories(): Promise<{ name: string; count: number }[]> {
    const response = await apiService.get<ApiResponse<{ categories: { name: string; count: number }[] }>>(
      `${API_ENDPOINTS.EVENTS.GET('')}/categories`
    );
    return response.data!.categories;
  }

  async isUserRegistered(eventId: string): Promise<boolean> {
    const response = await apiService.get<ApiResponse<{ isRegistered: boolean }>>(
      `${API_ENDPOINTS.EVENTS.GET(eventId)}/register/check`
    );
    return response.data!.isRegistered;
  }

  // Legacy methods for backward compatibility
  async registerForEventLegacy(id: string): Promise<void> {
    await this.registerForEvent(id);
  }
}

export const eventService = new EventService();
export default eventService;

