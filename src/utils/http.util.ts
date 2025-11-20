/**
 * HTTP utility functions
 * Provides common HTTP request utilities
 */

/**
 * Check if response is successful
 * @param status - HTTP status code
 * @returns True if status is successful
 */
export const isSuccessStatus = (status: number): boolean => {
  return status >= 200 && status < 300;
};

/**
 * Check if status is client error (4xx)
 * @param status - HTTP status code
 * @returns True if status is client error
 */
export const isClientError = (status: number): boolean => {
  return status >= 400 && status < 500;
};

/**
 * Check if status is server error (5xx)
 * @param status - HTTP status code
 * @returns True if status is server error
 */
export const isServerError = (status: number): boolean => {
  return status >= 500 && status < 600;
};

/**
 * Get error message from HTTP status code
 * @param status - HTTP status code
 * @returns Error message
 */
export const getStatusMessage = (status: number): string => {
  const messages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    413: 'Payload Too Large',
    414: 'URI Too Long',
    415: 'Unsupported Media Type',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
  };

  return messages[status] || 'Unknown Error';
};

/**
 * Build query string from object
 * @param params - Query parameters object
 * @returns Query string
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          searchParams.append(key, String(item));
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};

/**
 * Parse query string to object
 * @param queryString - Query string
 * @returns Parsed object
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

/**
 * Build URL with query parameters
 * @param baseUrl - Base URL
 * @param params - Query parameters
 * @returns URL with query string
 */
export const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const queryString = buildQueryString(params);
  const separator = baseUrl.includes('?') ? '&' : '?';

  return `${baseUrl}${separator}${queryString}`;
};

/**
 * Check if URL is absolute
 * @param url - URL to check
 * @returns True if URL is absolute
 */
export const isAbsoluteUrl = (url: string): boolean => {
  return /^https?:\/\//i.test(url);
};

/**
 * Normalize URL
 * @param url - URL to normalize
 * @returns Normalized URL
 */
export const normalizeUrl = (url: string): string => {
  if (isAbsoluteUrl(url)) {
    return url;
  }

  // Remove leading/trailing slashes and add protocol if needed
  let normalized = url.replace(/^\/+|\/+$/g, '');

  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }

  return normalized;
};

/**
 * Get domain from URL
 * @param url - URL
 * @returns Domain name
 */
export const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return '';
  }
};

/**
 * Get path from URL
 * @param url - URL
 * @returns Path name
 */
export const getPath = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch (error) {
    return '';
  }
};

/**
 * Add query parameter to URL
 * @param url - URL
 * @param key - Parameter key
 * @param value - Parameter value
 * @returns URL with added parameter
 */
export const addQueryParam = (url: string, key: string, value: string): string => {
  const urlObj = new URL(url);
  urlObj.searchParams.set(key, value);
  return urlObj.toString();
};

/**
 * Remove query parameter from URL
 * @param url - URL
 * @param key - Parameter key
 * @returns URL without parameter
 */
export const removeQueryParam = (url: string, key: string): string => {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(key);
  return urlObj.toString();
};

/**
 * Get query parameter from URL
 * @param url - URL
 * @param key - Parameter key
 * @returns Parameter value or null
 */
export const getQueryParam = (url: string, key: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(key);
  } catch (error) {
    return null;
  }
};

/**
 * Build form data from object
 * @param data - Data object
 * @returns FormData object
 */
export const buildFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, String(item));
        });
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};

/**
 * Build multipart form data
 * @param data - Data object
 * @param files - Files object
 * @returns FormData object
 */
export const buildMultipartFormData = (
  data: Record<string, any>,
  files?: Record<string, File | File[]>
): FormData => {
  const formData = buildFormData(data);

  if (files) {
    Object.entries(files).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, value);
      }
    });
  }

  return formData;
};

/**
 * Serialize object to URL-encoded string
 * @param data - Data object
 * @returns URL-encoded string
 */
export const serialize = (data: Record<string, any>): string => {
  return buildQueryString(data).replace(/\+/g, '%20');
};

/**
 * Deserialize URL-encoded string to object
 * @param str - URL-encoded string
 * @returns Parsed object
 */
export const deserialize = (str: string): Record<string, string> => {
  return parseQueryString(str);
};

/**
 * Fetch with timeout
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds
 * @returns Fetch promise
 */
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = 30000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

/**
 * Retry fetch request
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param maxRetries - Maximum number of retries
 * @param delay - Delay between retries in milliseconds
 * @returns Fetch promise
 */
export const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  delay: number = 1000
): Promise<Response> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || attempt === maxRetries) {
        return response;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
    }
  }

  throw lastError || new Error('Fetch failed');
};

/**
 * Download file from URL
 * @param url - File URL
 * @param filename - Download filename
 * @returns Promise that resolves when download starts
 */
export const downloadFile = async (url: string, filename?: string): Promise<void> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename || getPath(url).split('/').pop() || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

/**
 * Upload file with progress
 * @param url - Upload URL
 * @param file - File to upload
 * @param onProgress - Progress callback
 * @param options - Additional fetch options
 * @returns Upload promise
 */
export const uploadFile = async (
  url: string,
  file: File,
  onProgress?: (progress: number) => void,
  options: RequestInit = {}
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: new Headers(),
        });
        resolve(response);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    xhr.open(options.method || 'POST', url);

    // Set headers
    if (options.headers) {
      Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    // Send file
    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
};

/**
 * Check if response has JSON content type
 * @param response - Fetch response
 * @returns True if response is JSON
 */
export const isJsonResponse = (response: Response): boolean => {
  const contentType = response.headers.get('content-type');
  return contentType !== null && contentType.includes('application/json');
};

/**
 * Parse response based on content type
 * @param response - Fetch response
 * @returns Parsed response data
 */
export const parseResponse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else if (contentType && contentType.includes('text/')) {
    return await response.text();
  } else if (contentType && contentType.includes('application/xml') || contentType?.includes('text/xml')) {
    return await response.text();
  } else {
    return await response.blob();
  }
};

/**
 * Handle error response
 * @param response - Fetch response
 * @returns Error object
 */
export const handleErrorResponse = async (response: Response): Promise<Error> => {
  let message = `Request failed with status ${response.status}`;

  try {
    if (isJsonResponse(response)) {
      const data = await response.json();
      message = data.message || data.error || message;
    } else {
      const text = await response.text();
      message = text || message;
    }
  } catch (error) {
    // Ignore parsing errors
  }

  const error = new Error(message);
  (error as any).status = response.status;
  (error as any).response = response;

  return error;
};

