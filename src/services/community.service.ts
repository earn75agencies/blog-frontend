import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../config/api.config';

export interface Community {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  avatar: string;
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  type: 'public' | 'private' | 'restricted';
  rules: string[];
  memberCount: number;
  postCount: number;
  isJoined: boolean;
  isModerator: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  settings: {
    allowPublicPosts: boolean;
    requireApproval: boolean;
    enableChat: boolean;
    enableEvents: boolean;
    enableResources: boolean;
  };
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
  lastActiveAt: string;
  postCount: number;
  reputation: number;
  isActive: boolean;
  contributions: {
    posts: number;
    comments: number;
    likes: number;
  };
}

export interface CommunityPost {
  id: string;
  communityId: string;
  community: Community;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'link' | 'poll' | 'event' | 'resource';
  attachments: PostAttachment[];
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
  isApproved: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  poll?: Poll;
  event?: PostEvent;
  resource?: PostResource;
}

export interface PostAttachment {
  id: string;
  postId: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnail?: string;
  order: number;
}

export interface Poll {
  id: string;
  postId: string;
  question: string;
  options: PollOption[];
  multipleChoice: boolean;
  allowAddOption: boolean;
  endDate?: string;
  totalVotes: number;
  isVoted: boolean;
  userVotes: string[];
  createdAt: string;
}

export interface PollOption {
  id: string;
  pollId: string;
  text: string;
  votes: number;
  percentage: number;
  isUserVote: boolean;
}

export interface PostEvent {
  id: string;
  postId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  isOnline: boolean;
  attendeeCount: number;
  maxAttendees?: number;
  isAttending: boolean;
  createdAt: string;
}

export interface PostResource {
  id: string;
  postId: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'book' | 'tool' | 'template' | 'course';
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  downloadCount: number;
  isBookmarked: boolean;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  parentId?: string;
  replies: CommunityComment[];
  likeCount: number;
  isLiked: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityAnalytics {
  communityId: string;
  totalMembers: number;
  activeMembers: number;
  newMembers: number;
  totalPosts: number;
  newPosts: number;
  totalComments: number;
  newComments: number;
  engagementRate: number;
  topContributors: {
    userId: string;
    username: string;
    avatar?: string;
    posts: number;
    comments: number;
    likes: number;
  }[];
  popularPosts: CommunityPost[];
  memberGrowth: {
    date: string;
    members: number;
    newMembers: number;
  }[];
  activityTrends: {
    date: string;
    posts: number;
    comments: number;
    likes: number;
  }[];
}

class CommunityService {
  async getAllCommunities(params?: {
    category?: string;
    type?: string;
    tags?: string[];
    search?: string;
    sort?: 'newest' | 'oldest' | 'popular' | 'members' | 'active';
    limit?: number;
    offset?: number;
  }): Promise<{ communities: Community[]; total: number }> {
    const response = await apiClient.get(API_ENDPOINTS.COMMUNITIES.LIST(), { params });
    return response.data;
  }

  async getCommunityById(id: string): Promise<Community> {
    const response = await apiClient.get(API_ENDPOINTS.COMMUNITIES.GET(id));
    return response.data;
  }

  async createCommunity(data: {
    name: string;
    description: string;
    shortDescription: string;
    category: string;
    tags: string[];
    type: 'public' | 'private' | 'restricted';
    rules: string[];
    settings: {
      allowPublicPosts: boolean;
      requireApproval: boolean;
      enableChat: boolean;
      enableEvents: boolean;
      enableResources: boolean;
    };
  }): Promise<Community> {
    const response = await apiClient.post(API_ENDPOINTS.COMMUNITIES.CREATE(), data);
    return response.data;
  }

  async updateCommunity(id: string, data: Partial<Community>): Promise<Community> {
    const response = await apiClient.put(API_ENDPOINTS.COMMUNITIES.GET(id), data);
    return response.data;
  }

  async deleteCommunity(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COMMUNITIES.GET(id));
  }

  async uploadCommunityCover(communityId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('coverImage', file);
    
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET(communityId)}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.coverImageUrl;
  }

  async uploadCommunityAvatar(communityId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET(communityId)}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.avatarUrl;
  }

  async joinCommunity(communityId: string, data?: {
    message?: string;
    inviteCode?: string;
  }): Promise<CommunityMember> {
    const response = await apiClient.post(API_ENDPOINTS.COMMUNITIES.JOIN(communityId), data);
    return response.data;
  }

  async leaveCommunity(communityId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COMMUNITIES.LEAVE(communityId));
  }

  async getCommunityMembers(communityId: string, params?: {
    role?: string;
    search?: string;
    sort?: 'newest' | 'oldest' | 'active' | 'reputation';
    limit?: number;
    offset?: number;
  }): Promise<{ members: CommunityMember[]; total: number }> {
    const response = await apiClient.get(API_ENDPOINTS.COMMUNITIES.MEMBERS(communityId), { params });
    return response.data;
  }

  async updateMemberRole(communityId: string, userId: string, role: 'member' | 'moderator' | 'admin'): Promise<CommunityMember> {
    const response = await apiClient.put(`${API_ENDPOINTS.COMMUNITIES.MEMBERS(communityId)}/${userId}/role`, { role });
    return response.data;
  }

  async removeMember(communityId: string, userId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COMMUNITIES.MEMBERS(communityId)}/${userId}`);
  }

  async getCommunityPosts(communityId: string, params?: {
    type?: string;
    tags?: string[];
    sort?: 'newest' | 'oldest' | 'popular' | 'trending';
    limit?: number;
    offset?: number;
  }): Promise<{ posts: CommunityPost[]; total: number }> {
    const response = await apiClient.get(API_ENDPOINTS.COMMUNITIES.POSTS(communityId), { params });
    return response.data;
  }

  async createCommunityPost(communityId: string, data: {
    title: string;
    content: string;
    type: 'text' | 'image' | 'video' | 'link' | 'poll' | 'event' | 'resource';
    tags?: string[];
    attachments?: File[];
    poll?: {
      question: string;
      options: string[];
      multipleChoice: boolean;
      allowAddOption: boolean;
      endDate?: string;
    };
    event?: {
      title: string;
      description: string;
      startDate: string;
      endDate: string;
      location?: string;
      isOnline: boolean;
      maxAttendees?: number;
    };
    resource?: {
      title: string;
      description: string;
      url: string;
      type: 'article' | 'video' | 'book' | 'tool' | 'template' | 'course';
      category: string;
      tags: string[];
    };
  }): Promise<CommunityPost> {
    const formData = new FormData();
    
    // Add basic fields
    Object.keys(data).forEach(key => {
      if (key !== 'attachments' && typeof data[key as keyof typeof data] !== 'object') {
        formData.append(key, String(data[key as keyof typeof data]));
      }
    });
    
    // Add nested objects as JSON
    if (data.poll) {
      formData.append('poll', JSON.stringify(data.poll));
    }
    if (data.event) {
      formData.append('event', JSON.stringify(data.event));
    }
    if (data.resource) {
      formData.append('resource', JSON.stringify(data.resource));
    }
    
    // Add files
    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }
    
    const response = await apiClient.post(API_ENDPOINTS.COMMUNITIES.POSTS(communityId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateCommunityPost(postId: string, data: {
    title?: string;
    content?: string;
    tags?: string[];
  }): Promise<CommunityPost> {
    const response = await apiClient.put(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}`, data);
    return response.data;
  }

  async deleteCommunityPost(postId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}`);
  }

  async likePost(postId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/like`);
  }

  async unlikePost(postId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/like`);
  }

  async bookmarkPost(postId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/bookmark`);
  }

  async unbookmarkPost(postId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/bookmark`);
  }

  async pinPost(postId: string): Promise<CommunityPost> {
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/pin`);
    return response.data;
  }

  async unpinPost(postId: string): Promise<CommunityPost> {
    const response = await apiClient.delete(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/pin`);
    return response.data;
  }

  async lockPost(postId: string): Promise<CommunityPost> {
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/lock`);
    return response.data;
  }

  async unlockPost(postId: string): Promise<CommunityPost> {
    const response = await apiClient.delete(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/lock`);
    return response.data;
  }

  async approvePost(postId: string): Promise<CommunityPost> {
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/approve`);
    return response.data;
  }

  async getPostComments(postId: string, params?: {
    sort?: 'newest' | 'oldest' | 'popular';
    limit?: number;
    offset?: number;
  }): Promise<{ comments: CommunityComment[]; total: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/comments`, { params });
    return response.data;
  }

  async createPostComment(postId: string, data: {
    content: string;
    parentId?: string;
  }): Promise<CommunityComment> {
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/comments`, data);
    return response.data;
  }

  async updateComment(commentId: string, data: {
    content: string;
  }): Promise<CommunityComment> {
    const response = await apiClient.put(`${API_ENDPOINTS.COMMUNITIES.GET('')}/comments/${commentId}`, data);
    return response.data;
  }

  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COMMUNITIES.GET('')}/comments/${commentId}`);
  }

  async likeComment(commentId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/comments/${commentId}/like`);
  }

  async unlikeComment(commentId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COMMUNITIES.GET('')}/comments/${commentId}/like`);
  }

  async voteInPoll(pollId: string, data: {
    optionIds: string[];
  }): Promise<Poll> {
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/polls/${pollId}/vote`, data);
    return response.data;
  }

  async attendEvent(eventId: string): Promise<PostEvent> {
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/events/${eventId}/attend`);
    return response.data;
  }

  async unattendEvent(eventId: string): Promise<PostEvent> {
    const response = await apiClient.delete(`${API_ENDPOINTS.COMMUNITIES.GET('')}/events/${eventId}/attend`);
    return response.data;
  }

  async rateResource(resourceId: string, data: {
    rating: number;
    review?: string;
  }): Promise<PostResource> {
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/resources/${resourceId}/rate`, data);
    return response.data;
  }

  async downloadResource(resourceId: string): Promise<string> {
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/resources/${resourceId}/download`);
    return response.data.downloadUrl;
  }

  async getCommunityAnalytics(communityId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<CommunityAnalytics> {
    const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITIES.GET(communityId)}/analytics`, { params });
    return response.data;
  }

  async searchCommunities(query: string, params?: {
    category?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ communities: Community[]; total: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITIES.GET('')}/search`, {
      params: { q: query, ...params },
    });
    return response.data;
  }

  async getTrendingCommunities(limit: number = 10): Promise<Community[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITIES.GET('')}/trending`, {
      params: { limit },
    });
    return response.data;
  }

  async getRecommendedCommunities(limit: number = 10): Promise<Community[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITIES.GET('')}/recommended`, {
      params: { limit },
    });
    return response.data;
  }

  async getCategories(): Promise<{ name: string; count: number }[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITIES.GET('')}/categories`);
    return response.data;
  }

  async getPopularTags(limit: number = 20): Promise<{ tag: string; count: number }[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITIES.GET('')}/tags`, {
      params: { limit },
    });
    return response.data;
  }

  async getUserCommunities(userId: string): Promise<{ communities: Community[]; total: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.COMMUNITIES.GET('')}/user/${userId}`);
    return response.data;
  }

  async inviteToCommunity(communityId: string, data: {
    userIds: string[];
    message?: string;
  }): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET(communityId)}/invite`, data);
  }

  async generateInviteCode(communityId: string): Promise<{ code: string; expiresAt: string }> {
    const response = await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET(communityId)}/invite-code`);
    return response.data;
  }

  async reportPost(postId: string, data: {
    reason: string;
    description?: string;
  }): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/posts/${postId}/report`, data);
  }

  async reportComment(commentId: string, data: {
    reason: string;
    description?: string;
  }): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.COMMUNITIES.GET('')}/comments/${commentId}/report`, data);
  }
}

export const communityService = new CommunityService();