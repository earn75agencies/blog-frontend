import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../config/api.config';

export interface Podcast {
  id: string;
  title: string;
  description: string;
  coverArt: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  totalEpisodes: number;
  totalDuration: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  rating: number;
  reviewCount: number;
  subscriberCount: number;
  language: string;
  website?: string;
  rssFeed?: string;
}

export interface Episode {
  id: string;
  podcastId: string;
  podcast: Podcast;
  title: string;
  description: string;
  content: string;
  audioUrl: string;
  duration: number;
  fileSize: number;
  episodeNumber: number;
  seasonNumber?: number;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  playCount: number;
  downloadCount: number;
  likeCount: number;
  transcript?: string;
  showNotes?: string;
  chapters?: Chapter[];
  guests?: Guest[];
}

export interface Chapter {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  description?: string;
  imageUrl?: string;
}

export interface Guest {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface PodcastReview {
  id: string;
  podcastId: string;
  userId: string;
  user: {
    username: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
}

export interface EpisodeProgress {
  id: string;
  userId: string;
  episodeId: string;
  currentTime: number;
  duration: number;
  isCompleted: boolean;
  lastPlayedAt: string;
  playCount: number;
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  episodes: Episode[];
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  podcastId: string;
  podcast: Podcast;
  subscribedAt: string;
  autoDownload: boolean;
  notificationsEnabled: boolean;
}

export interface PodcastAnalytics {
  podcastId: string;
  totalPlays: number;
  uniqueListeners: number;
  averageListenTime: number;
  completionRate: number;
  topEpisodes: Episode[];
  listenerDemographics: {
    countries: { country: string; count: number }[];
    ageGroups: { ageGroup: string; count: number }[];
    devices: { device: string; count: number }[];
  };
  trends: {
    daily: { date: string; plays: number }[];
    weekly: { week: string; plays: number }[];
    monthly: { month: string; plays: number }[];
  };
}

class PodcastService {
  async getAllPodcasts(params?: {
    category?: string;
    tags?: string[];
    language?: string;
    sort?: 'newest' | 'oldest' | 'popular' | 'rating';
    limit?: number;
    offset?: number;
  }): Promise<{ podcasts: Podcast[]; total: number }> {
    const response = await apiClient.get(API_ENDPOINTS.PODCASTS.LIST(), { params });
    return response.data;
  }

  async getPodcastById(id: string): Promise<Podcast> {
    const response = await apiClient.get(API_ENDPOINTS.PODCASTS.GET(id));
    return response.data;
  }

  async createPodcast(data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    language: string;
    website?: string;
    rssFeed?: string;
  }): Promise<Podcast> {
    const response = await apiClient.post(API_ENDPOINTS.PODCASTS.CREATE(), data);
    return response.data;
  }

  async updatePodcast(id: string, data: Partial<Podcast>): Promise<Podcast> {
    const response = await apiClient.put(API_ENDPOINTS.PODCASTS.UPDATE(id), data);
    return response.data;
  }

  async deletePodcast(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PODCASTS.DELETE(id));
  }

  async uploadPodcastCover(podcastId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('coverArt', file);
    
    const response = await apiClient.post(`${API_ENDPOINTS.PODCASTS.GET(podcastId)}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.coverArtUrl;
  }

  async getPodcastEpisodes(podcastId: string, params?: {
    season?: number;
    published?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ episodes: Episode[]; total: number }> {
    const response = await apiClient.get(API_ENDPOINTS.PODCASTS.EPISODES(podcastId), { params });
    return response.data;
  }

  async createEpisode(podcastId: string, data: {
    title: string;
    description: string;
    content: string;
    episodeNumber: number;
    seasonNumber?: number;
    showNotes?: string;
    guests?: Guest[];
  }): Promise<Episode> {
    const response = await apiClient.post(`${API_ENDPOINTS.PODCASTS.EPISODES(podcastId)}`, data);
    return response.data;
  }

  async updateEpisode(episodeId: string, data: Partial<Episode>): Promise<Episode> {
    const response = await apiClient.put(`${API_ENDPOINTS.PODCASTS.GET('')}/episodes/${episodeId}`, data);
    return response.data;
  }

  async deleteEpisode(episodeId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PODCASTS.GET('')}/episodes/${episodeId}`);
  }

  async uploadEpisodeAudio(episodeId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('audio', file);
    
    const response = await apiClient.post(`${API_ENDPOINTS.PODCASTS.GET('')}/episodes/${episodeId}/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.audioUrl;
  }

  async getEpisodeById(episodeId: string): Promise<Episode> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/episodes/${episodeId}`);
    return response.data;
  }

  async playEpisode(episodeId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.PODCASTS.GET('')}/episodes/${episodeId}/play`);
  }

  async likeEpisode(episodeId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.PODCASTS.GET('')}/episodes/${episodeId}/like`);
  }

  async unlikeEpisode(episodeId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PODCASTS.GET('')}/episodes/${episodeId}/like`);
  }

  async downloadEpisode(episodeId: string): Promise<string> {
    const response = await apiClient.post(`${API_ENDPOINTS.PODCASTS.GET('')}/episodes/${episodeId}/download`);
    return response.data.downloadUrl;
  }

  async updateEpisodeProgress(episodeId: string, currentTime: number, duration: number): Promise<EpisodeProgress> {
    const response = await apiClient.put(`${API_ENDPOINTS.PODCASTS.GET('')}/episodes/${episodeId}/progress`, {
      currentTime,
      duration,
    });
    return response.data;
  }

  async getEpisodeProgress(episodeId: string): Promise<EpisodeProgress | null> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/episodes/${episodeId}/progress`);
    return response.data;
  }

  async getPodcastReviews(podcastId: string, params?: {
    rating?: number;
    sort?: 'newest' | 'oldest' | 'rating';
    limit?: number;
    offset?: number;
  }): Promise<{ reviews: PodcastReview[]; total: number; averageRating: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET(podcastId)}/reviews`, { params });
    return response.data;
  }

  async createPodcastReview(podcastId: string, data: {
    rating: number;
    comment: string;
  }): Promise<PodcastReview> {
    const response = await apiClient.post(`${API_ENDPOINTS.PODCASTS.GET(podcastId)}/reviews`, data);
    return response.data;
  }

  async updatePodcastReview(reviewId: string, data: {
    rating?: number;
    comment?: string;
  }): Promise<PodcastReview> {
    const response = await apiClient.put(`${API_ENDPOINTS.PODCASTS.GET('')}/reviews/${reviewId}`, data);
    return response.data;
  }

  async deletePodcastReview(reviewId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PODCASTS.GET('')}/reviews/${reviewId}`);
  }

  async subscribeToPodcast(podcastId: string, options?: {
    autoDownload?: boolean;
    notificationsEnabled?: boolean;
  }): Promise<Subscription> {
    const response = await apiClient.post(`${API_ENDPOINTS.PODCASTS.GET(podcastId)}/subscribe`, options);
    return response.data;
  }

  async unsubscribeFromPodcast(podcastId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PODCASTS.GET(podcastId)}/subscribe`);
  }

  async getUserSubscriptions(params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ subscriptions: Subscription[]; total: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/subscriptions`, { params });
    return response.data;
  }

  async isSubscribedToPodcast(podcastId: string): Promise<boolean> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET(podcastId)}/subscribe/check`);
    return response.data.isSubscribed;
  }

  async getUserPlaylists(params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ playlists: Playlist[]; total: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/playlists`, { params });
    return response.data;
  }

  async createPlaylist(data: {
    name: string;
    description?: string;
    isPublic?: boolean;
  }): Promise<Playlist> {
    const response = await apiClient.post(`${API_ENDPOINTS.PODCASTS.GET('')}/playlists`, data);
    return response.data;
  }

  async updatePlaylist(playlistId: string, data: Partial<Playlist>): Promise<Playlist> {
    const response = await apiClient.put(`${API_ENDPOINTS.PODCASTS.GET('')}/playlists/${playlistId}`, data);
    return response.data;
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PODCASTS.GET('')}/playlists/${playlistId}`);
  }

  async addEpisodeToPlaylist(playlistId: string, episodeId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.PODCASTS.GET('')}/playlists/${playlistId}/episodes`, {
      episodeId,
    });
  }

  async removeEpisodeFromPlaylist(playlistId: string, episodeId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PODCASTS.GET('')}/playlists/${playlistId}/episodes/${episodeId}`);
  }

  async getPlaylistById(playlistId: string): Promise<Playlist> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/playlists/${playlistId}`);
    return response.data;
  }

  async getPublicPlaylists(params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ playlists: Playlist[]; total: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/playlists/public`, { params });
    return response.data;
  }

  async getPodcastAnalytics(podcastId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<PodcastAnalytics> {
    const response = await apiClient.get(API_ENDPOINTS.PODCASTS.ANALYTICS(podcastId), { params });
    return response.data;
  }

  async searchPodcasts(query: string, params?: {
    category?: string;
    language?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ podcasts: Podcast[]; episodes: Episode[]; total: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/search`, {
      params: { q: query, ...params },
    });
    return response.data;
  }

  async getTrendingPodcasts(timeframe: 'day' | 'week' | 'month' = 'week', limit: number = 10): Promise<Podcast[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/trending`, {
      params: { timeframe, limit },
    });
    return response.data;
  }

  async getRecommendedPodcasts(limit: number = 10): Promise<Podcast[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/recommended`, {
      params: { limit },
    });
    return response.data;
  }

  async getCategories(): Promise<{ name: string; count: number }[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/categories`);
    return response.data;
  }

  async getPopularTags(limit: number = 20): Promise<{ tag: string; count: number }[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.PODCASTS.GET('')}/tags`, {
      params: { limit },
    });
    return response.data;
  }
}

export const podcastService = new PodcastService();