import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../config/api.config';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirements: string[];
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  createdAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeId: string;
  badge: Badge;
  unlockedAt: string;
  progress: number;
  totalRequired: number;
  isCompleted: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  totalPoints: number;
  rank: number;
  badges: Achievement[];
  level: number;
  weeklyPoints: number;
  monthlyPoints: number;
}

export interface UserStats {
  userId: string;
  totalPoints: number;
  level: number;
  currentLevelPoints: number;
  nextLevelPoints: number;
  badges: Achievement[];
  achievements: Achievement[];
  streak: number;
  joinDate: string;
  lastActiveDate: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  points: number;
  requirements: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  participants: number;
  badgeReward?: Badge;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  challenge: Challenge;
  progress: number;
  totalRequired: number;
  isCompleted: boolean;
  completedAt?: string;
  startedAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'badge' | 'points' | 'certificate' | 'privilege';
  value: number | string;
  icon: string;
  requirements: {
    points?: number;
    level?: number;
    badges?: string[];
    achievements?: string[];
  };
  isActive: boolean;
  expiryDate?: string;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  reward: Reward;
  claimedAt: string;
  isUsed: boolean;
  usedAt?: string;
}

class GamificationService {
  async getUserStats(userId: string): Promise<UserStats> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.USER_STATS}/${userId}`);
    return response.data;
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.ACHIEVEMENTS}/${userId}`);
    return response.data;
  }

  async getLeaderboard(type: 'global' | 'weekly' | 'monthly' = 'global', limit: number = 50): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.LEADERBOARD}`, {
      params: { type, limit }
    });
    return response.data;
  }

  async getUserRank(userId: string): Promise<LeaderboardEntry> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.LEADERBOARD}/${userId}`);
    return response.data;
  }

  async getAllBadges(): Promise<Badge[]> {
    const response = await apiClient.get(API_ENDPOINTS.GAMIFICATION.BADGES);
    return response.data;
  }

  async getBadgeById(badgeId: string): Promise<Badge> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.BADGES}/${badgeId}`);
    return response.data;
  }

  async getActiveChallenges(): Promise<Challenge[]> {
    const response = await apiClient.get(API_ENDPOINTS.GAMIFICATION.CHALLENGES);
    return response.data;
  }

  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.USER_CHALLENGES}/${userId}`);
    return response.data;
  }

  async joinChallenge(challengeId: string): Promise<UserChallenge> {
    const response = await apiClient.post(`${API_ENDPOINTS.GAMIFICATION.CHALLENGES}/${challengeId}/join`);
    return response.data;
  }

  async updateChallengeProgress(challengeId: string, progress: number): Promise<UserChallenge> {
    const response = await apiClient.put(`${API_ENDPOINTS.GAMIFICATION.USER_CHALLENGES}/${challengeId}/progress`, {
      progress
    });
    return response.data;
  }

  async getAvailableRewards(): Promise<Reward[]> {
    const response = await apiClient.get(API_ENDPOINTS.GAMIFICATION.REWARDS);
    return response.data;
  }

  async getUserRewards(userId: string): Promise<UserReward[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.USER_REWARDS}/${userId}`);
    return response.data;
  }

  async claimReward(rewardId: string): Promise<UserReward> {
    const response = await apiClient.post(`${API_ENDPOINTS.GAMIFICATION.REWARDS}/${rewardId}/claim`);
    return response.data;
  }

  async useReward(rewardId: string): Promise<UserReward> {
    const response = await apiClient.put(`${API_ENDPOINTS.GAMIFICATION.USER_REWARDS}/${rewardId}/use`);
    return response.data;
  }

  async trackActivity(activity: {
    type: string;
    metadata?: Record<string, any>;
    points?: number;
  }): Promise<{
    pointsEarned: number;
    achievementsUnlocked: Achievement[];
    levelUp: boolean;
    newLevel?: number;
  }> {
    const response = await apiClient.post(`${API_ENDPOINTS.GAMIFICATION.TRACK_ACTIVITY}`, activity);
    return response.data;
  }

  async getPointsHistory(userId: string, limit: number = 50): Promise<{
    id: string;
    type: string;
    points: number;
    description: string;
    createdAt: string;
  }[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.POINTS_HISTORY}/${userId}`, {
      params: { limit }
    });
    return response.data;
  }

  async getStreakInfo(userId: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
    streakHistory: {
      date: string;
      isActive: boolean;
    }[];
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.STREAK}/${userId}`);
    return response.data;
  }

  async compareStats(userId1: string, userId2: string): Promise<{
    user1: UserStats;
    user2: UserStats;
    comparison: {
      pointsDifference: number;
      levelDifference: number;
      badgesDifference: number;
      achievementsDifference: number;
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.COMPARE}/${userId1}/${userId2}`);
    return response.data;
  }

  async getNotifications(userId: string): Promise<{
    id: string;
    type: 'achievement' | 'level_up' | 'challenge_completed' | 'reward_available';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data?: any;
  }[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.GAMIFICATION.NOTIFICATIONS}/${userId}`);
    return response.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`${API_ENDPOINTS.GAMIFICATION.NOTIFICATIONS}/${notificationId}/read`);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.GAMIFICATION.NOTIFICATIONS}/${notificationId}`);
  }
}

export const gamificationService = new GamificationService();