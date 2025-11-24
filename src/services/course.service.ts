import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../config/api.config';

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  instructor: {
    id: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
  category: string;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  price: number;
  currency: string;
  duration: number; // in minutes
  totalLessons: number;
  totalStudents: number;
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  prerequisites: string[];
  learningObjectives: string[];
  materials: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  isPublished: boolean;
  isPreview: boolean;
  resources: LessonResource[];
  quiz?: Quiz;
  createdAt: string;
  updatedAt: string;
}

export interface LessonResource {
  id: string;
  lessonId: string;
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'link' | 'file';
  url: string;
  fileSize?: number;
  mimeType?: string;
  order: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  passingScore: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[]; // for multiple choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  enrolledAt: string;
  completedAt?: string;
  progress: number; // 0-100
  lastAccessedAt: string;
  certificateId?: string;
  isCompleted: boolean;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number; // in minutes
  lastPosition: number; // video position in seconds
  quizAttempts: QuizAttempt[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: QuizAnswer[];
  score: number;
  totalPoints: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  timeSpent: number; // in minutes
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  enrollmentId: string;
  issuedAt: string;
  certificateUrl: string;
  verificationCode: string;
  instructorSignature?: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  user: {
    username: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  pros?: string[];
  cons?: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseAnalytics {
  courseId: string;
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  averageCompletionTime: number;
  revenue: number;
  lessonCompletionRates: {
    lessonId: string;
    lessonTitle: string;
    completionRate: number;
    averageTimeSpent: number;
  }[];
  studentProgress: {
    userId: string;
    username: string;
    progress: number;
    lastAccessedAt: string;
  }[];
  quizPerformance: {
    quizId: string;
    quizTitle: string;
    averageScore: number;
    passRate: number;
    attempts: number;
  }[];
}

class CourseService {
  async getAllCourses(params?: {
    category?: string;
    level?: string;
    language?: string;
    priceRange?: [number, number];
    tags?: string[];
    instructor?: string;
    sort?: 'newest' | 'oldest' | 'popular' | 'rating' | 'price-low' | 'price-high';
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ courses: Course[]; total: number }> {
    const response = await apiClient.get(API_ENDPOINTS.COURSES.LIST(), { params });
    return response.data;
  }

  async getCourseById(id: string): Promise<Course> {
    const response = await apiClient.get(API_ENDPOINTS.COURSES.GET(id));
    return response.data;
  }

  async createCourse(data: {
    title: string;
    description: string;
    shortDescription: string;
    category: string;
    tags: string[];
    level: 'beginner' | 'intermediate' | 'advanced';
    language: string;
    price: number;
    currency: string;
    prerequisites: string[];
    learningObjectives: string[];
    materials: string[];
  }): Promise<Course> {
    const response = await apiClient.post(API_ENDPOINTS.COURSES.CREATE(), data);
    return response.data;
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    const response = await apiClient.put(API_ENDPOINTS.COURSES.UPDATE(id), data);
    return response.data;
  }

  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COURSES.DELETE(id));
  }

  async uploadCourseCover(courseId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('coverImage', file);
    
    const response = await apiClient.post(`${API_ENDPOINTS.COURSES.GET(courseId)}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.coverImageUrl;
  }

  async publishCourse(id: string): Promise<Course> {
    const response = await apiClient.post(`${API_ENDPOINTS.COURSES.GET(id)}/publish`);
    return response.data;
  }

  async unpublishCourse(id: string): Promise<Course> {
    const response = await apiClient.post(`${API_ENDPOINTS.COURSES.GET(id)}/unpublish`);
    return response.data;
  }

  async getCourseLessons(courseId: string, params?: {
    published?: boolean;
    includeUnpublished?: boolean;
  }): Promise<{ lessons: Lesson[]; total: number }> {
    const response = await apiClient.get(API_ENDPOINTS.COURSES.LESSONS(courseId), { params });
    return response.data;
  }

  async createLesson(courseId: string, data: {
    title: string;
    description: string;
    content: string;
    videoUrl?: string;
    duration: number;
    order: number;
    isPreview?: boolean;
  }): Promise<Lesson> {
    const response = await apiClient.post(`${API_ENDPOINTS.COURSES.LESSONS(courseId)}`, data);
    return response.data;
  }

  async updateLesson(lessonId: string, data: Partial<Lesson>): Promise<Lesson> {
    const response = await apiClient.put(`${API_ENDPOINTS.COURSES.GET('')}/lessons/${lessonId}`, data);
    return response.data;
  }

  async deleteLesson(lessonId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COURSES.GET('')}/lessons/${lessonId}`);
  }

  async uploadLessonVideo(lessonId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('video', file);
    
    const response = await apiClient.post(`${API_ENDPOINTS.COURSES.GET('')}/lessons/${lessonId}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.videoUrl;
  }

  async enrollInCourse(courseId: string, paymentData?: {
    paymentMethodId: string;
    amount: number;
    currency: string;
  }): Promise<Enrollment> {
    const response = await apiClient.post(API_ENDPOINTS.COURSES.ENROLL(courseId), paymentData);
    return response.data;
  }

  async getUserEnrollments(params?: {
    status?: 'active' | 'completed' | 'all';
    limit?: number;
    offset?: number;
  }): Promise<{ enrollments: Enrollment[]; total: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/enrollments`, { params });
    return response.data;
  }

  async getEnrollmentById(enrollmentId: string): Promise<Enrollment> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/enrollments/${enrollmentId}`);
    return response.data;
  }

  async getCourseProgress(courseId: string): Promise<{
    enrollment: Enrollment;
    lessons: LessonProgress[];
    overallProgress: number;
    timeSpent: number;
    estimatedCompletionTime: number;
  }> {
    const response = await apiClient.get(API_ENDPOINTS.COURSES.PROGRESS(courseId));
    return response.data;
  }

  async updateLessonProgress(lessonId: string, data: {
    isCompleted?: boolean;
    timeSpent?: number;
    lastPosition?: number;
    notes?: string;
  }): Promise<LessonProgress> {
    const response = await apiClient.put(`${API_ENDPOINTS.COURSES.GET('')}/lessons/${lessonId}/progress`, data);
    return response.data;
  }

  async getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/lessons/${lessonId}/progress`);
    return response.data;
  }

  async startQuiz(quizId: string): Promise<{
    attemptId: string;
    quiz: Quiz;
    timeLimit: number;
  }> {
    const response = await apiClient.post(`${API_ENDPOINTS.COURSES.GET('')}/quizzes/${quizId}/start`);
    return response.data;
  }

  async submitQuizAttempt(attemptId: string, answers: {
    questionId: string;
    answer: string | string[];
  }[]): Promise<QuizAttempt> {
    const response = await apiClient.post(`${API_ENDPOINTS.COURSES.GET('')}/quiz-attempts/${attemptId}/submit`, {
      answers,
    });
    return response.data;
  }

  async getQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/quizzes/${quizId}/attempts`);
    return response.data;
  }

  async getCourseReviews(courseId: string, params?: {
    rating?: number;
    sort?: 'newest' | 'oldest' | 'rating';
    limit?: number;
    offset?: number;
  }): Promise<{ reviews: CourseReview[]; total: number; averageRating: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET(courseId)}/reviews`, { params });
    return response.data;
  }

  async createCourseReview(courseId: string, data: {
    rating: number;
    comment: string;
    pros?: string[];
    cons?: string[];
  }): Promise<CourseReview> {
    const response = await apiClient.post(`${API_ENDPOINTS.COURSES.GET(courseId)}/reviews`, data);
    return response.data;
  }

  async updateCourseReview(reviewId: string, data: {
    rating?: number;
    comment?: string;
    pros?: string[];
    cons?: string[];
  }): Promise<CourseReview> {
    const response = await apiClient.put(`${API_ENDPOINTS.COURSES.GET('')}/reviews/${reviewId}`, data);
    return response.data;
  }

  async deleteCourseReview(reviewId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COURSES.GET('')}/reviews/${reviewId}`);
  }

  async getCertificate(enrollmentId: string): Promise<Certificate> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/enrollments/${enrollmentId}/certificate`);
    return response.data;
  }

  async generateCertificate(enrollmentId: string): Promise<Certificate> {
    const response = await apiClient.post(`${API_ENDPOINTS.COURSES.GET('')}/enrollments/${enrollmentId}/certificate`);
    return response.data;
  }

  async downloadCertificate(certificateId: string): Promise<string> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/certificates/${certificateId}/download`);
    return response.data.downloadUrl;
  }

  async verifyCertificate(verificationCode: string): Promise<{
    isValid: boolean;
    certificate?: Certificate;
    message?: string;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/certificates/verify/${verificationCode}`);
    return response.data;
  }

  async getCourseAnalytics(courseId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<CourseAnalytics> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET(courseId)}/analytics`, { params });
    return response.data;
  }

  async searchCourses(query: string, params?: {
    category?: string;
    level?: string;
    language?: string;
    priceRange?: [number, number];
    limit?: number;
    offset?: number;
  }): Promise<{ courses: Course[]; total: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/search`, {
      params: { q: query, ...params },
    });
    return response.data;
  }

  async getTrendingCourses(limit: number = 10): Promise<Course[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/trending`, {
      params: { limit },
    });
    return response.data;
  }

  async getRecommendedCourses(limit: number = 10): Promise<Course[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/recommended`, {
      params: { limit },
    });
    return response.data;
  }

  async getCategories(): Promise<{ name: string; count: number }[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/categories`);
    return response.data;
  }

  async getPopularTags(limit: number = 20): Promise<{ tag: string; count: number }[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/tags`, {
      params: { limit },
    });
    return response.data;
  }

  async getInstructorCourses(instructorId: string): Promise<{ courses: Course[]; total: number }> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET('')}/instructor/${instructorId}`);
    return response.data;
  }

  async duplicateCourse(courseId: string): Promise<Course> {
    const response = await apiClient.post(`${API_ENDPOINTS.COURSES.GET(courseId)}/duplicate`);
    return response.data;
  }

  async exportCourse(courseId: string, format: 'json' | 'csv' | 'pdf'): Promise<string> {
    const response = await apiClient.get(`${API_ENDPOINTS.COURSES.GET(courseId)}/export`, {
      params: { format },
    });
    return response.data.downloadUrl;
  }
}

export const courseService = new CourseService();