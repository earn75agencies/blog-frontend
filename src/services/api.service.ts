import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api.config';
import { useAuthStore } from '../store/authStore';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Get API base URL from localStorage or environment
    // In development, use relative URL to leverage Vite proxy
    // In production, use environment variable or absolute URL
    const isDevelopment = import.meta.env.DEV;
    const envApiUrl = import.meta.env.VITE_API_BASE_URL;
    
    let storedApiUrl: string | null = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        storedApiUrl = localStorage.getItem('apiBaseUrl');
      }
    } catch (error) {
      console.warn('Failed to access localStorage in ApiService:', error);
    }
    
    if (isDevelopment && !envApiUrl && !storedApiUrl) {
      // Use relative URL in development to leverage Vite proxy
      this.baseURL = '/api';
    } else {
      // Use explicit URL from environment, localStorage, or fallback
      this.baseURL = storedApiUrl || envApiUrl || 'http://localhost:5000/api';
    }

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.initializeApiConfig();
  }

  /**
   * Initialize API configuration from backend
   */
  private async initializeApiConfig() {
    try {
      // Try to fetch config from backend
      // If baseURL is '/api', use '/api/config' directly (relative URL via proxy)
      // Otherwise, construct the full URL
      const configUrl = this.baseURL === '/api' 
        ? '/api/config'
        : `${this.baseURL.replace(/\/api$/, '')}/api/config`;
      
      const response = await axios.get(configUrl, {
        timeout: 5000,
      });

      if (response.data?.data?.apiBaseUrl) {
        const newBaseUrl = response.data.data.apiBaseUrl;
        if (newBaseUrl !== this.baseURL) {
          this.baseURL = newBaseUrl;
          this.api.defaults.baseURL = newBaseUrl;
          try {
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('apiBaseUrl', newBaseUrl);
            }
          } catch (error) {
            console.warn('Failed to save API base URL to localStorage:', error);
          }
        }
      }
    } catch (error) {
      // Silently fail - use existing base URL
      console.warn('Could not fetch API config from backend, using existing configuration');
    }
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      (config) => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            const token = localStorage.getItem('token');
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
        } catch (error) {
          console.warn('Failed to access localStorage for token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            let refreshToken: string | null = null;
            try {
              if (typeof window !== 'undefined' && window.localStorage) {
                refreshToken = localStorage.getItem('refreshToken');
              }
            } catch (error) {
              console.warn('Failed to access localStorage for refreshToken:', error);
            }
            
            if (refreshToken) {
              const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN(), {
                refreshToken,
              });

              const { token } = response.data.data;
              try {
                if (typeof window !== 'undefined' && window.localStorage) {
                  localStorage.setItem('token', token);
                }
              } catch (error) {
                console.warn('Failed to save token to localStorage:', error);
              }
              
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }

              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed - logout user
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const message = retryAfter
            ? `Too many requests. Please try again after ${retryAfter} seconds.`
            : 'Too many requests. Please try again later.';
          toast.error(message);
          return Promise.reject(error);
        }

        // Handle 403 - Forbidden
        if (error.response?.status === 403) {
          toast.error('You do not have permission to perform this action.');
          return Promise.reject(error);
        }

        // Handle 404 - Not Found
        if (error.response?.status === 404) {
          const message = this.getErrorMessage(error);
          if (message) {
            toast.error(message);
          }
          return Promise.reject(error);
        }

        // Handle 500 - Server Error
        if (error.response?.status === 500) {
          toast.error('Server error. Please try again later.');
          return Promise.reject(error);
        }

        // Handle other errors
        const message = this.getErrorMessage(error);
        if (message && error.response?.status !== 401) {
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );
  }

  private getErrorMessage(error: AxiosError): string | null {
    // Handle rate limiting
    if (error.response?.status === 429) {
      return 'Too many requests. Please try again later.';
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      return 'Network error. Please check your connection and try again.';
    }

    // Handle timeout errors
    if (error.code === 'ETIMEDOUT') {
      return 'Request timeout. Please try again.';
    }

    if (error.response?.data) {
      const data = error.response.data as any;
      if (data.message) {
        return data.message;
      }
      if (data.error) {
        return data.error;
      }
    }
    if (error.message) {
      return error.message;
    }
    return 'An error occurred. Please try again.';
  }

  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  // POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  // PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  // PATCH request
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  // Upload file
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.api.post<T>(url, formData, config);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;

