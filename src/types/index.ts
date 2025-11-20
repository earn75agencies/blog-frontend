export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'author' | 'admin';
  isEmailVerified: boolean;
  isActive: boolean;
  followers?: User[];
  following?: User[];
  postsCount?: number;
  favoritePosts?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: User;
  category: Category;
  tags: Tag[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  views: number;
  likes: string[];
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isFeatured: boolean;
  allowComments: boolean;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  post: string | Post;
  author: User;
  parentComment?: string | Comment;
  likes: string[];
  isEdited: boolean;
  isApproved: boolean;
  isSpam: boolean;
  replies?: Comment[];
  replyCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
  postsCount?: number;
  parent?: string;
  level?: number;
  icon?: string;
  color?: string;
  featured?: boolean;
  subcategories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  results?: number;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tags?: string[];
  author?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FormErrors {
  [key: string]: string;
}

export interface Notification {
  _id: string;
  user: string | User;
  type: 'post_like' | 'post_comment' | 'comment_reply' | 'post_published' | 'user_follow' | 'mention' | 'system';
  title: string;
  message: string;
  link?: string;
  relatedUser?: User;
  relatedPost?: Post;
  relatedComment?: Comment;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  siteName: string;
  siteDescription: string;
  siteLogo?: string;
  siteFavicon?: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  allowComments: boolean;
  moderateComments: boolean;
  postsPerPage: number;
  enableAnalytics: boolean;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
  };
  email: {
    fromName: string;
    fromEmail?: string;
    replyTo?: string;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
}

