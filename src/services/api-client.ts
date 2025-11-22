/**
 * API Request Interceptor
 * Implements caching, retry logic, and request deduplication
 */

import axios from 'axios';

/**
 * Create API client with optimizations
 */
export const createOptimizedApiClient = () => {
  const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 30000,
  });

  // Cache for duplicate request deduplication
  const pendingRequests = new Map();

  /**
   * Request interceptor - Add deduplication
   */
  apiClient.interceptors.request.use(
    async (config) => {
      const isCacheable = config.method === 'get';
      const cacheKey = `${config.method}:${config.url}`;

      // Deduplicate pending requests
      if (isCacheable && pendingRequests.has(cacheKey)) {
        console.log(`🔄 Waiting for duplicate request: ${cacheKey}`);
        return pendingRequests.get(cacheKey);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Response interceptor - Retry logic
   */
  apiClient.interceptors.response.use(
    async (response) => {
      const cacheKey = `${response.config.method}:${response.config.url}`;

      // Clear pending request
      pendingRequests.delete(cacheKey);

      return response;
    },
    async (error: any) => {
      const config = error.config;
      if (!config) {
        return Promise.reject(error);
      }

      if (!config.retry) {
        config.retry = 0;
      }

      config.retry += 1;
      const maxRetries = 3;
      const retryDelay = Math.pow(2, config.retry) * 1000; // Exponential backoff

      if (config.retry < maxRetries && isRetryableError(error)) {
        console.log(`🔄 Retry ${config.retry}/${maxRetries} after ${retryDelay}ms`);

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return apiClient(config);
      }

      // Clear pending request
      const cacheKey = `${config.method}:${config.url}`;
      pendingRequests.delete(cacheKey);

      return Promise.reject(error);
    }
  );

  return apiClient;
};

/**
 * Check if error is retryable
 */
const isRetryableError = (error: any): boolean => {
  if (!error.response) {
    // Network error
    return true;
  }

  const status = error.response.status;
  // Retry on 5xx errors and 429 (rate limit)
  return status >= 500 || status === 429;
};

export const apiClient = createOptimizedApiClient();

export default apiClient;
