/**
 * API Configuration
 * Fetches API base URL from backend environment variables
 */

// Default API base URL (fallback)
const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

// Get API base URL from environment or use default
// In development, prefer relative URL to leverage Vite proxy
const isDevelopment = import.meta.env.DEV;
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                   (isDevelopment ? '/api' : DEFAULT_API_BASE_URL);

// Function to fetch API config from backend
let configFetched = false;
let configPromise: Promise<void> | null = null;

/**
 * Fetch API configuration from backend
 * This ensures the frontend uses the same API URL as configured in backend .env
 */
export const fetchApiConfig = async (): Promise<void> => {
  if (configFetched) {
    return;
  }

  if (configPromise) {
    return configPromise;
  }

  configPromise = (async () => {
    try {
      // Try to fetch config from backend
      // Use a temporary base URL to fetch the config endpoint
      // In development, prefer relative URL to leverage Vite proxy
      let tempBaseUrl;
      if (import.meta.env.VITE_API_BASE_URL) {
        tempBaseUrl = import.meta.env.VITE_API_BASE_URL;
      } else if (isDevelopment && typeof window !== 'undefined') {
        // Use relative URL in development
        tempBaseUrl = '/api';
      } else if (typeof window !== 'undefined') {
        tempBaseUrl = `${window.location.protocol}//${window.location.hostname}:5000/api`;
      } else {
        tempBaseUrl = DEFAULT_API_BASE_URL;
      }
      
      // Construct the config endpoint URL
      // If tempBaseUrl is '/api', we're using relative URL, so use '/api/config'
      // Otherwise, remove '/api' suffix and append '/api/config'
      const configUrl = tempBaseUrl === '/api' 
        ? '/api/config'
        : `${tempBaseUrl.replace(/\/api$/, '')}/api/config`;
      
      const response = await fetch(configUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.apiBaseUrl) {
          API_BASE_URL = data.data.apiBaseUrl;
          // Store in localStorage for future use
          if (typeof window !== 'undefined') {
            localStorage.setItem('apiBaseUrl', API_BASE_URL);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to fetch API config from backend, using default:', error);
      // Use stored value or default
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('apiBaseUrl');
        if (stored) {
          API_BASE_URL = stored;
        }
      }
    } finally {
      configFetched = true;
    }
  })();

  return configPromise;
};

// Initialize API config on module load (for browser environments)
if (typeof window !== 'undefined') {
  // Check if we have a stored API base URL
  const stored = localStorage.getItem('apiBaseUrl');
  if (stored) {
    API_BASE_URL = stored;
  }

  // Fetch fresh config from backend
  fetchApiConfig().catch(console.error);
}

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: () => `${API_BASE_URL}/auth/register`,
    LOGIN: () => `${API_BASE_URL}/auth/login`,
    LOGOUT: () => `${API_BASE_URL}/auth/logout`,
    ME: () => `${API_BASE_URL}/auth/me`,
    UPDATE_PASSWORD: () => `${API_BASE_URL}/auth/update-password`,
    FORGOT_PASSWORD: () => `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: () => `${API_BASE_URL}/auth/reset-password`,
    VERIFY_EMAIL: (token: string) => `${API_BASE_URL}/auth/verify-email/${token}`,
    RESEND_VERIFICATION: () => `${API_BASE_URL}/auth/resend-verification`,
    REFRESH_TOKEN: () => `${API_BASE_URL}/auth/refresh-token`,
  },
  
  // Users
  USERS: {
    LIST: () => `${API_BASE_URL}/users`,
    GET: (id: string) => `${API_BASE_URL}/users/${id}`,
    PROFILE: (username: string) => `${API_BASE_URL}/users/profile/${username}`,
    UPDATE: (id: string) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
    FOLLOW: (id: string) => `${API_BASE_URL}/users/${id}/follow`,
    UNFOLLOW: (id: string) => `${API_BASE_URL}/users/${id}/unfollow`,
    FOLLOWERS: (id: string) => `${API_BASE_URL}/users/${id}/followers`,
    FOLLOWING: (id: string) => `${API_BASE_URL}/users/${id}/following`,
    POSTS: (id: string) => `${API_BASE_URL}/users/${id}/posts`,
  },
  
  // Posts
  POSTS: {
    LIST: () => `${API_BASE_URL}/posts`,
    GET: (slug: string) => `${API_BASE_URL}/posts/${slug}`,
    CREATE: () => `${API_BASE_URL}/posts`,
    UPDATE: (id: string) => `${API_BASE_URL}/posts/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/posts/${id}`,
    LIKE: (id: string) => `${API_BASE_URL}/posts/${id}/like`,
    UNLIKE: (id: string) => `${API_BASE_URL}/posts/${id}/unlike`,
    FEATURED: () => `${API_BASE_URL}/posts/featured`,
    POPULAR: () => `${API_BASE_URL}/posts/popular`,
    TRENDING: () => `${API_BASE_URL}/posts/trending`,
    BY_CATEGORY: (categoryId: string) => `${API_BASE_URL}/posts/category/${categoryId}`,
    BY_TAG: (tagId: string) => `${API_BASE_URL}/posts/tag/${tagId}`,
    BY_AUTHOR: (authorId: string) => `${API_BASE_URL}/posts/author/${authorId}`,
    SEARCH: () => `${API_BASE_URL}/posts/search`,
    RELATED: (id: string) => `${API_BASE_URL}/posts/${id}/related`,
    PUBLISH: (id: string) => `${API_BASE_URL}/posts/${id}/publish`,
    UNPUBLISH: (id: string) => `${API_BASE_URL}/posts/${id}/unpublish`,
    ARCHIVE: (id: string) => `${API_BASE_URL}/posts/${id}/archive`,
    DUPLICATE: (id: string) => `${API_BASE_URL}/posts/${id}/duplicate`,
    EXPORT: (id: string) => `${API_BASE_URL}/posts/${id}/export`,
    IMPORT: () => `${API_BASE_URL}/posts/import`,
    BULK_DELETE: () => `${API_BASE_URL}/posts/bulk/delete`,
    BULK_UPDATE: () => `${API_BASE_URL}/posts/bulk/update`,
  },
  
  // Comments
  COMMENTS: {
    BY_POST: (postId: string) => `${API_BASE_URL}/comments/post/${postId}`,
    GET: (id: string) => `${API_BASE_URL}/comments/${id}`,
    CREATE: () => `${API_BASE_URL}/comments`,
    UPDATE: (id: string) => `${API_BASE_URL}/comments/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/comments/${id}`,
    LIKE: (id: string) => `${API_BASE_URL}/comments/${id}/like`,
    UNLIKE: (id: string) => `${API_BASE_URL}/comments/${id}/unlike`,
    REPLIES: (id: string) => `${API_BASE_URL}/comments/${id}/replies`,
  },
  
  // Categories
  CATEGORIES: {
    LIST: () => `${API_BASE_URL}/categories`,
    HIERARCHY: () => `${API_BASE_URL}/categories/hierarchy`,
    GET: (slug: string) => `${API_BASE_URL}/categories/${slug}`,
    CREATE: () => `${API_BASE_URL}/categories`,
    UPDATE: (id: string) => `${API_BASE_URL}/categories/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/categories/${id}`,
    POSTS: (id: string) => `${API_BASE_URL}/categories/${id}/posts`,
  },
  
  // Tags
  TAGS: {
    LIST: () => `${API_BASE_URL}/tags`,
    POPULAR: () => `${API_BASE_URL}/tags/popular`,
    GET: (slug: string) => `${API_BASE_URL}/tags/${slug}`,
    CREATE: () => `${API_BASE_URL}/tags`,
    UPDATE: (id: string) => `${API_BASE_URL}/tags/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/tags/${id}`,
    POSTS: (id: string) => `${API_BASE_URL}/tags/${id}/posts`,
  },
  
  // Analytics
  ANALYTICS: {
    OVERVIEW: () => `${API_BASE_URL}/analytics/overview`,
    POSTS: () => `${API_BASE_URL}/analytics/posts`,
    USERS: () => `${API_BASE_URL}/analytics/users`,
    TRENDS: () => `${API_BASE_URL}/analytics/trends`,
    GEOGRAPHIC: () => `${API_BASE_URL}/analytics/geographic`,
    DEVICES: () => `${API_BASE_URL}/analytics/devices`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: () => `${API_BASE_URL}/notifications`,
    UNREAD_COUNT: () => `${API_BASE_URL}/notifications/unread-count`,
    MARK_READ: (id: string) => `${API_BASE_URL}/notifications/${id}/read`,
    MARK_ALL_READ: () => `${API_BASE_URL}/notifications/read-all`,
    DELETE: (id: string) => `${API_BASE_URL}/notifications/${id}`,
  },
  
  // Admin
  ADMIN: {
    OVERVIEW: () => `${API_BASE_URL}/admin/overview`,
    USERS: () => `${API_BASE_URL}/admin/users`,
    UPDATE_USER_ROLE: (id: string) => `${API_BASE_URL}/admin/users/${id}/role`,
    POSTS: () => `${API_BASE_URL}/admin/posts`,
    APPROVE_COMMENT: (id: string) => `${API_BASE_URL}/admin/comments/${id}/approve`,
    REJECT_COMMENT: (id: string) => `${API_BASE_URL}/admin/comments/${id}/reject`,
    SETTINGS: () => `${API_BASE_URL}/admin/settings`,
  },
  
  // Views
  VIEWS: {
    TRACK: () => `${API_BASE_URL}/views`,
  },
  
  // Bookmarks
  BOOKMARKS: {
    LIST: () => `${API_BASE_URL}/bookmarks`,
    ADD: () => `${API_BASE_URL}/bookmarks`,
    REMOVE: (postId: string) => `${API_BASE_URL}/bookmarks/${postId}`,
    UPDATE: (postId: string) => `${API_BASE_URL}/bookmarks/${postId}`,
    CHECK: (postId: string) => `${API_BASE_URL}/bookmarks/check/${postId}`,
    FOLDERS: () => `${API_BASE_URL}/bookmarks/folders`,
  },
  
  // Payments
  PAYMENTS: {
    LIST: () => `${API_BASE_URL}/payments`,
    GET: (id: string) => `${API_BASE_URL}/payments/${id}`,
    CREATE: () => `${API_BASE_URL}/payments`,
    UPDATE_STATUS: (id: string) => `${API_BASE_URL}/payments/${id}/status`,
    WEBHOOK: () => `${API_BASE_URL}/payments/webhook`,
  },



  // SEO
  SEO: {
    SITEMAP: () => `${API_BASE_URL}/seo/sitemap`,
    ROBOTS: () => `${API_BASE_URL}/seo/robots`,
  },

  // Config
  CONFIG: {
    GET: () => `${API_BASE_URL.replace('/api', '')}/api/config`,
  },

  // Contact
  CONTACT: {
    SEND: () => `${API_BASE_URL}/contact`,
  },

  // VR/AR Content
  VR: {
    CONTENT: {
      CREATE: () => `${API_BASE_URL}/vr-content`,
      GET: (id: string) => `${API_BASE_URL}/vr-content/${id}`,
      UPDATE: (id: string) => `${API_BASE_URL}/vr-content/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/vr-content/${id}`,
      USER: (userId: string) => `${API_BASE_URL}/vr-content/user/${userId}`,
      MINE: () => `${API_BASE_URL}/vr-content/mine`,
      ADD_3D_MODEL: (id: string) => `${API_BASE_URL}/vr-content/${id}/3d-model`,
      GET_3D_MODELS: (id: string) => `${API_BASE_URL}/vr-content/${id}/3d-models`,
      UPDATE_3D_MODEL: (id: string) => `${API_BASE_URL}/vr-content/3d-model/${id}`,
      DELETE_3D_MODEL: (id: string) => `${API_BASE_URL}/vr-content/3d-model/${id}`,
      ADD_SPATIAL_AUDIO: (id: string) => `${API_BASE_URL}/vr-content/${id}/spatial-audio`,
      GET_SPATIAL_AUDIO: (id: string) => `${API_BASE_URL}/vr-content/${id}/spatial-audio`,
      UPDATE_SPATIAL_AUDIO: (id: string) => `${API_BASE_URL}/vr-content/spatial-audio/${id}`,
      DELETE_SPATIAL_AUDIO: (id: string) => `${API_BASE_URL}/vr-content/spatial-audio/${id}`,
      FEATURED: () => `${API_BASE_URL}/vr-content/featured`,
      TRENDING: (timeframe: string) => `${API_BASE_URL}/vr-content/trending?timeframe=${timeframe}`,
      SEARCH: () => `${API_BASE_URL}/vr-content/search`,
      ANALYTICS: (id: string) => `${API_BASE_URL}/vr-content/${id}/analytics`,
      UPDATE_SETTINGS: (id: string) => `${API_BASE_URL}/vr-content/${id}/settings`,
      CHECK_COMPATIBILITY: () => `${API_BASE_URL}/vr-content/compatibility`,
    },
  },

  // Gamification
  GAMIFICATION: {
    USER_STATS: (userId: string) => `${API_BASE_URL}/gamification/user-stats/${userId}`,
    ACHIEVEMENTS: (userId: string) => `${API_BASE_URL}/gamification/achievements/${userId}`,
    LEADERBOARD: () => `${API_BASE_URL}/gamification/leaderboard`,
    BADGES: () => `${API_BASE_URL}/gamification/badges`,
    CHALLENGES: () => `${API_BASE_URL}/gamification/challenges`,
    USER_CHALLENGES: (userId: string) => `${API_BASE_URL}/gamification/user-challenges/${userId}`,
    REWARDS: () => `${API_BASE_URL}/gamification/rewards`,
    USER_REWARDS: (userId: string) => `${API_BASE_URL}/gamification/user-rewards/${userId}`,
    TRACK_ACTIVITY: () => `${API_BASE_URL}/gamification/track-activity`,
    POINTS_HISTORY: (userId: string) => `${API_BASE_URL}/gamification/points-history/${userId}`,
    STREAK: (userId: string) => `${API_BASE_URL}/gamification/streak/${userId}`,
    COMPARE: (userId1: string, userId2: string) => `${API_BASE_URL}/gamification/compare/${userId1}/${userId2}`,
    NOTIFICATIONS: (userId: string) => `${API_BASE_URL}/gamification/notifications/${userId}`,
  },

  // Podcasts
  PODCASTS: {
    LIST: () => `${API_BASE_URL}/podcasts`,
    GET: (id: string) => `${API_BASE_URL}/podcasts/${id}`,
    CREATE: () => `${API_BASE_URL}/podcasts`,
    UPDATE: (id: string) => `${API_BASE_URL}/podcasts/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/podcasts/${id}`,
    EPISODES: (id: string) => `${API_BASE_URL}/podcasts/${id}/episodes`,
    ANALYTICS: (id: string) => `${API_BASE_URL}/podcasts/${id}/analytics`,
  },

  // Courses
  COURSES: {
    LIST: () => `${API_BASE_URL}/courses`,
    GET: (id: string) => `${API_BASE_URL}/courses/${id}`,
    CREATE: () => `${API_BASE_URL}/courses`,
    UPDATE: (id: string) => `${API_BASE_URL}/courses/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/courses/${id}`,
    LESSONS: (id: string) => `${API_BASE_URL}/courses/${id}/lessons`,
    ENROLL: (id: string) => `${API_BASE_URL}/courses/${id}/enroll`,
    PROGRESS: (id: string) => `${API_BASE_URL}/courses/${id}/progress`,
    CERTIFICATE: (id: string) => `${API_BASE_URL}/courses/${id}/certificate`,
  },

  // Events
  EVENTS: {
    LIST: () => `${API_BASE_URL}/events`,
    GET: (id: string) => `${API_BASE_URL}/events/${id}`,
    CREATE: () => `${API_BASE_URL}/events`,
    UPDATE: (id: string) => `${API_BASE_URL}/events/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/events/${id}`,
    REGISTER: (id: string) => `${API_BASE_URL}/events/${id}/register`,
    CANCEL_REGISTRATION: (id: string) => `${API_BASE_URL}/events/${id}/register`,
    ATTENDEES: (id: string) => `${API_BASE_URL}/events/${id}/attendees`,
  },

  // Communities
  COMMUNITIES: {
    LIST: () => `${API_BASE_URL}/communities`,
    GET: (id: string) => `${API_BASE_URL}/communities/${id}`,
    CREATE: () => `${API_BASE_URL}/communities`,
    JOIN: (id: string) => `${API_BASE_URL}/communities/${id}/join`,
    LEAVE: (id: string) => `${API_BASE_URL}/communities/${id}/leave`,
    POSTS: (id: string) => `${API_BASE_URL}/communities/${id}/posts`,
    MEMBERS: (id: string) => `${API_BASE_URL}/communities/${id}/members`,
  },
};

// Helper function to get current API base URL
export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};

// Helper function to update API base URL (after fetching from backend)
export const setApiBaseUrl = (url: string): void => {
  API_BASE_URL = url;
  if (typeof window !== 'undefined') {
    localStorage.setItem('apiBaseUrl', url);
  }
};

export default API_ENDPOINTS;
