import { useAuth } from '../contexts/AuthContext';

// API base URL - configure based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// API client with JWT token handling
class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - logout user
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        window.location.href = '/login';
        throw new Error('Authentication expired');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  // File upload with progress
  async uploadFile<T>(
    endpoint: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else if (xhr.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          window.location.href = '/login';
          reject(new Error('Authentication expired'));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', `${API_BASE_URL}${endpoint}`);
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Hook for API calls with automatic token handling
export const useApi = () => {
  const { refreshToken } = useAuth();

  return {
    get: <T>(endpoint: string) => apiClient.get<T>(endpoint),
    post: <T>(endpoint: string, data?: any) => apiClient.post<T>(endpoint, data),
    put: <T>(endpoint: string, data?: any) => apiClient.put<T>(endpoint, data),
    patch: <T>(endpoint: string, data?: any) => apiClient.patch<T>(endpoint, data),
    delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
    uploadFile: <T>(endpoint: string, file: File, onProgress?: (progress: number) => void) => 
      apiClient.uploadFile<T>(endpoint, file, onProgress),
    refreshToken,
  };
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Jobs
  JOBS: {
    LIST: '/jobs',
    CREATE: '/jobs',
    GET: (id: string) => `/jobs/${id}`,
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    APPLICANTS: (id: string) => `/jobs/${id}/applicants`,
  },
  
  // Candidates
  CANDIDATES: {
    LIST: '/candidates',
    CREATE: '/candidates',
    GET: (id: string) => `/candidates/${id}`,
    UPDATE: (id: string) => `/candidates/${id}`,
    DELETE: (id: string) => `/candidates/${id}`,
    RESUME: (id: string) => `/candidates/${id}/resume`,
  },
  
  // Interviews
  INTERVIEWS: {
    LIST: '/interviews',
    CREATE: '/interviews',
    GET: (id: string) => `/interviews/${id}`,
    UPDATE: (id: string) => `/interviews/${id}`,
    DELETE: (id: string) => `/interviews/${id}`,
    JOIN: (id: string) => `/interviews/${id}/join`,
    FEEDBACK: (id: string) => `/interviews/${id}/feedback`,
  },
  
  // Pipelines
  PIPELINES: {
    LIST: '/pipelines',
    CREATE: '/pipelines',
    GET: (id: string) => `/pipelines/${id}`,
    UPDATE: (id: string) => `/pipelines/${id}`,
    DELETE: (id: string) => `/pipelines/${id}`,
  },
  
  // Reports
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    GET: (id: string) => `/reports/${id}`,
    GENERATE: '/reports/generate',
  },
  
  // Users (Admin only)
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
} as const;
