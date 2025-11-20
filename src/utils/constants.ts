/**
 * Application constants
 */

// API endpoints
// In development, prefer relative URL to leverage Vite proxy
// In production, use environment variable or absolute URL
const isDevelopment = import.meta.env.DEV;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                            (isDevelopment ? '/api' : 'http://localhost:5000/api');

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Date formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT = 'HH:mm:ss';

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Validation limits
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_POST_TITLE_LENGTH = 3;
export const MAX_POST_TITLE_LENGTH = 200;
export const MIN_POST_CONTENT_LENGTH = 100;
export const MAX_POST_CONTENT_LENGTH = 50000;
export const MIN_COMMENT_LENGTH = 1;
export const MAX_COMMENT_LENGTH = 2000;

// Cache TTL (in seconds)
export const CACHE_TTL_SHORT = 60; // 1 minute
export const CACHE_TTL_MEDIUM = 300; // 5 minutes
export const CACHE_TTL_LONG = 3600; // 1 hour
export const CACHE_TTL_VERY_LONG = 86400; // 24 hours

// Rate limiting
export const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recentSearches',
  BOOKMARKS: 'bookmarks',
} as const;

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Language options
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  RU: 'ru',
  ZH: 'zh',
  JA: 'ja',
  KO: 'ko',
  AR: 'ar',
  HI: 'hi',
} as const;

// Post statuses
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// User roles
export const USER_ROLES = {
  USER: 'user',
  AUTHOR: 'author',
  ADMIN: 'admin',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  COMMENT_REPLY: 'comment_reply',
  POST_PUBLISHED: 'post_published',
  USER_FOLLOW: 'user_follow',
  MENTION: 'mention',
  SYSTEM: 'system',
} as const;

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const;

// Event statuses
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Sort options
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  MOST_VIEWED: 'mostViewed',
  MOST_LIKED: 'mostLiked',
  MOST_COMMENTED: 'mostCommented',
  TITLE_ASC: 'titleAsc',
  TITLE_DESC: 'titleDesc',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Debounce delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  SCROLL: 100,
  RESIZE: 150,
} as const;

// Throttle delays (in milliseconds)
export const THROTTLE_DELAYS = {
  SCROLL: 100,
  RESIZE: 150,
  MOUSEMOVE: 100,
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Toast durations (in milliseconds)
export const TOAST_DURATIONS = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
} as const;

// Modal sizes
export const MODAL_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  FULL: 'full',
} as const;

// Avatar sizes
export const AVATAR_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const;

// Button variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  DANGER: 'danger',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Button sizes
export const BUTTON_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const;

// Badge variants
export const BADGE_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  OUTLINE: 'outline',
} as const;

// Alert variants
export const ALERT_VARIANTS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Tab variants
export const TAB_VARIANTS = {
  DEFAULT: 'default',
  PILLS: 'pills',
  UNDERLINE: 'underline',
} as const;

// Card variants
export const CARD_VARIANTS = {
  DEFAULT: 'default',
  OUTLINED: 'outlined',
  ELEVATED: 'elevated',
  FLAT: 'flat',
} as const;

// Loading spinner sizes
export const SPINNER_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const;

// Image aspect ratios
export const IMAGE_ASPECT_RATIOS = {
  SQUARE: '1:1',
  LANDSCAPE: '16:9',
  PORTRAIT: '9:16',
  CINEMA: '21:9',
} as const;

// SEO defaults
export const SEO_DEFAULTS = {
  TITLE: 'Gidix - Your Source for Quality Content',
  DESCRIPTION: 'Discover engaging articles, insights, and stories on Gidix. Your go-to destination for quality content.',
  KEYWORDS: 'blog, articles, content, insights, stories',
  AUTHOR: 'Gidix',
  SITE_NAME: 'Gidix',
  LOCALE: 'en_US',
  TYPE: 'website',
} as const;

// Social media platforms
export const SOCIAL_PLATFORMS = {
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  REDDIT: 'reddit',
  WHATSAPP: 'whatsapp',
  TELEGRAM: 'telegram',
  EMAIL: 'email',
} as const;

// Reading time calculation
export const WORDS_PER_MINUTE = 200;
export const AVERAGE_WORD_LENGTH = 5;

// View tracking
export const VIEW_TRACKING_INTERVAL = 60 * 60 * 1000; // 1 hour

// Search
export const MIN_SEARCH_LENGTH = 2;
export const MAX_SEARCH_RESULTS = 50;
export const SEARCH_HIGHLIGHT_LENGTH = 150;

// Comments
export const MAX_COMMENT_DEPTH = 5;
export const COMMENTS_PER_PAGE = 20;

// Notifications
export const NOTIFICATIONS_PER_PAGE = 20;
export const MAX_NOTIFICATIONS = 100;

// Bookmarks
export const DEFAULT_BOOKMARK_FOLDER = 'default';
export const BOOKMARKS_PER_PAGE = 20;

// Analytics
export const ANALYTICS_DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL_TIME: 'all',
} as const;

// Export/Import
export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully.',
  UPDATED: 'Resource updated successfully.',
  DELETED: 'Resource deleted successfully.',
  SAVED: 'Changes saved successfully.',
  PUBLISHED: 'Post published successfully.',
  UNPUBLISHED: 'Post unpublished successfully.',
  ARCHIVED: 'Post archived successfully.',
} as const;

// Local storage keys
export const LS_KEYS = {
  ...STORAGE_KEYS,
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
  GRID_VIEW: 'gridView',
  LIST_VIEW: 'listView',
  ITEMS_PER_PAGE: 'itemsPerPage',
  SORT_BY: 'sortBy',
  FILTERS: 'filters',
  LAST_VISITED: 'lastVisited',
} as const;

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  USERNAME: /^[a-zA-Z0-9_]+$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  IP_ADDRESS: /^(\d{1,3}\.){3}\d{1,3}$/,
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_COMMENTS: true,
  ENABLE_LIKES: true,
  ENABLE_SHARING: true,
  ENABLE_BOOKMARKS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_SUBSCRIPTIONS: true,
  ENABLE_PAYMENTS: true,
  ENABLE_EVENTS: true,
  ENABLE_SEARCH: true,
  ENABLE_RSS: true,
  ENABLE_SITEMAP: true,
} as const;

export default {
  API_BASE_URL,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_POST_TITLE_LENGTH,
  MAX_POST_TITLE_LENGTH,
  MIN_POST_CONTENT_LENGTH,
  MAX_POST_CONTENT_LENGTH,
  MIN_COMMENT_LENGTH,
  MAX_COMMENT_LENGTH,
  CACHE_TTL_SHORT,
  CACHE_TTL_MEDIUM,
  CACHE_TTL_LONG,
  CACHE_TTL_VERY_LONG,
  RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX_REQUESTS,
  STORAGE_KEYS,
  THEMES,
  LANGUAGES,
  POST_STATUS,
  USER_ROLES,
  NOTIFICATION_TYPES,
  PAYMENT_STATUS,
  EVENT_STATUS,
  SORT_OPTIONS,
  BREAKPOINTS,
  DEBOUNCE_DELAYS,
  THROTTLE_DELAYS,
  ANIMATION_DURATIONS,
  TOAST_DURATIONS,
  MODAL_SIZES,
  AVATAR_SIZES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  BADGE_VARIANTS,
  ALERT_VARIANTS,
  TAB_VARIANTS,
  CARD_VARIANTS,
  SPINNER_SIZES,
  IMAGE_ASPECT_RATIOS,
  SEO_DEFAULTS,
  SOCIAL_PLATFORMS,
  WORDS_PER_MINUTE,
  AVERAGE_WORD_LENGTH,
  VIEW_TRACKING_INTERVAL,
  MIN_SEARCH_LENGTH,
  MAX_SEARCH_RESULTS,
  SEARCH_HIGHLIGHT_LENGTH,
  MAX_COMMENT_DEPTH,
  COMMENTS_PER_PAGE,
  NOTIFICATIONS_PER_PAGE,
  MAX_NOTIFICATIONS,
  DEFAULT_BOOKMARK_FOLDER,
  BOOKMARKS_PER_PAGE,
  ANALYTICS_DATE_RANGES,
  EXPORT_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LS_KEYS,
  REGEX_PATTERNS,
  FEATURE_FLAGS,
};
