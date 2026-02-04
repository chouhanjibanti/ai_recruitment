import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuth } from '../contexts/AuthContext';

// API base URLs for different modules
const API_BASE_URLS = {
  MAIN: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  RESUME_PARSER: import.meta.env.VITE_RESUME_PARSER_API || 'http://localhost:3002/v1',
  INTERVIEW_ENGINE: import.meta.env.VITE_INTERVIEW_API || 'http://localhost:3003/v1',
  AVATAR_SERVICE: import.meta.env.VITE_AVATAR_API || 'http://localhost:3004/api',
};

// Enhanced API client with module-specific endpoints
class ApiService {
  private mainApi: AxiosInstance;
  private resumeParserApi: AxiosInstance;
  private interviewApi: AxiosInstance;
  private avatarApi: AxiosInstance;

  constructor() {
    // Main API client
    this.mainApi = axios.create({
      baseURL: API_BASE_URLS.MAIN,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Resume Parser API client (Module 1)
    this.resumeParserApi = axios.create({
      baseURL: API_BASE_URLS.RESUME_PARSER,
      timeout: 30000, // Longer timeout for file processing
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Interview Engine API client (Module 2)
    this.interviewApi = axios.create({
      baseURL: API_BASE_URLS.INTERVIEW_ENGINE,
      timeout: 60000, // Extended timeout for AI processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Avatar Service API client
    this.avatarApi = axios.create({
      baseURL: API_BASE_URLS.AVATAR_SERVICE,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup interceptors for all clients
    this.setupInterceptors(this.mainApi);
    this.setupInterceptors(this.resumeParserApi);
    this.setupInterceptors(this.interviewApi);
    this.setupInterceptors(this.avatarApi);
  }

  private setupInterceptors(apiClient: AxiosInstance) {
    // Request interceptor - Add JWT token
    apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors and token refresh
    apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh token
            const refreshResponse = await this.mainApi.post('/auth/refresh');
            const newToken = refreshResponse.data.token;
            
            localStorage.setItem('authToken', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed - logout user
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Main API methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.mainApi.get(endpoint, config);
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.mainApi.post(endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.mainApi.put(endpoint, data, config);
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.mainApi.patch(endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.mainApi.delete(endpoint, config);
  }

  // Resume Parser API (Module 1)
  async parseResume(file: File, onProgress?: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    formData.append('resume', file);

    return this.resumeParserApi.post('/parse', formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  async extractSkills(resumeText: string): Promise<any> {
    return this.resumeParserApi.post('/extract-skills', { text: resumeText });
  }

  async analyzeExperience(resumeText: string): Promise<any> {
    return this.resumeParserApi.post('/analyze-experience', { text: resumeText });
  }

  // Interview Engine API (Module 2)
  async startInterviewSession(candidateId: string, jobId: string): Promise<any> {
    return this.interviewApi.post('/sessions/start', { candidateId, jobId });
  }

  async submitInterviewAnswer(sessionId: string, answer: string): Promise<any> {
    return this.interviewApi.post(`/sessions/${sessionId}/answer`, { answer });
  }

  async getInterviewFeedback(sessionId: string): Promise<any> {
    return this.interviewApi.get(`/sessions/${sessionId}/feedback`);
  }

  async getInterviewTranscript(sessionId: string): Promise<any> {
    return this.interviewApi.get(`/sessions/${sessionId}/transcript`);
  }

  async generateInterviewQuestions(jobId: string, candidateProfile: any): Promise<any> {
    return this.interviewApi.post('/questions/generate', { jobId, candidateProfile });
  }

  // Avatar Service API
  async triggerAvatarAnimation(animation: string, parameters?: any): Promise<any> {
    return this.avatarApi.post('/animate', { animation, parameters });
  }

  async setAvatarExpression(expression: string): Promise<any> {
    return this.avatarApi.post('/expression', { expression });
  }

  async getAvatarState(): Promise<any> {
    return this.avatarApi.get('/state');
  }

  // File upload with progress tracking
  async uploadFile(file: File, type: 'resume' | 'avatar' | 'other', onProgress?: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.mainApi.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Batch operations
  async batchRequest<T>(requests: Array<{ method: string; url: string; data?: any }>): Promise<T[]> {
    const promises = requests.map(async req => {
      let response;
      switch (req.method.toLowerCase()) {
        case 'get':
          response = await this.mainApi.get(req.url);
          break;
        case 'post':
          response = await this.mainApi.post(req.url, req.data);
          break;
        case 'put':
          response = await this.mainApi.put(req.url, req.data);
          break;
        case 'delete':
          response = await this.mainApi.delete(req.url);
          break;
        default:
          throw new Error(`Unsupported method: ${req.method}`);
      }
      return response.data;
    });

    return Promise.all(promises);
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Hook for using API service with auth
export const useApiService = () => {
  const { refreshToken } = useAuth();

  return {
    // Main API
    get: <T>(endpoint: string, config?: AxiosRequestConfig) => apiService.get<T>(endpoint, config),
    post: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) => apiService.post<T>(endpoint, data, config),
    put: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) => apiService.put<T>(endpoint, data, config),
    patch: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) => apiService.patch<T>(endpoint, data, config),
    delete: <T>(endpoint: string, config?: AxiosRequestConfig) => apiService.delete<T>(endpoint, config),

    // Resume Parser (Module 1)
    parseResume: (file: File, onProgress?: (progress: number) => void) => 
      apiService.parseResume(file, onProgress),
    extractSkills: (resumeText: string) => apiService.extractSkills(resumeText),
    analyzeExperience: (resumeText: string) => apiService.analyzeExperience(resumeText),

    // Interview Engine (Module 2)
    startInterviewSession: (candidateId: string, jobId: string) => 
      apiService.startInterviewSession(candidateId, jobId),
    submitInterviewAnswer: (sessionId: string, answer: string) => 
      apiService.submitInterviewAnswer(sessionId, answer),
    getInterviewFeedback: (sessionId: string) => apiService.getInterviewFeedback(sessionId),
    getInterviewTranscript: (sessionId: string) => apiService.getInterviewTranscript(sessionId),
    generateInterviewQuestions: (jobId: string, candidateProfile: any) => 
      apiService.generateInterviewQuestions(jobId, candidateProfile),

    // Avatar Service
    triggerAvatarAnimation: (animation: string, parameters?: any) => 
      apiService.triggerAvatarAnimation(animation, parameters),
    setAvatarExpression: (expression: string) => apiService.setAvatarExpression(expression),
    getAvatarState: () => apiService.getAvatarState(),

    // File Operations
    uploadFile: (file: File, type: 'resume' | 'avatar' | 'other', onProgress?: (progress: number) => void) => 
      apiService.uploadFile(file, type, onProgress),
    batchRequest: <T>(requests: Array<{ method: string; url: string; data?: any }>) => 
      apiService.batchRequest<T>(requests),

    refreshToken,
  };
};
