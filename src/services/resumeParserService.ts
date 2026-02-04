import { apiService } from './apiService';

// Types for Module 1: Resume Parser API
export interface ResumeUploadResponse {
  success: boolean;
  data: {
    resume_id: string;
    filename: string;
    file_size: number;
    file_type: string;
    upload_timestamp: string;
    status: string;
  };
  message: string;
}

export interface ParsedProfile {
  personal_info: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  skills: {
    technical: string[];
    soft: string[];
    certifications: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    duration: string;
  }>;
}

export interface ResumeParseResponse {
  success: boolean;
  data: {
    resume_id: string;
    parsed_profile: ParsedProfile;
    parsing_metadata: {
      confidence_score: number;
      missing_fields: string[];
      warnings: string[];
      processing_time_ms: number;
      parsed_at: string;
    };
  };
  message: string;
}

export interface ResumeDetailsResponse {
  success: boolean;
  data: {
    resume_id: string;
    file_info: {
      filename: string;
      file_size: number;
      file_type: string;
      upload_timestamp: string;
    };
    raw_text: string;
    parsed_profile: ParsedProfile;
    parsing_history: Array<{
      parse_id: string;
      timestamp: string;
      confidence_score: number;
      version: string;
    }>;
  };
}

export interface ReparseOptions {
  force_reparse?: boolean;
  parsing_options: {
    extract_skills?: boolean;
    extract_experience?: boolean;
    extract_education?: boolean;
    extract_projects?: boolean;
    confidence_threshold?: number;
    use_latest_model?: boolean;
  };
}

// Module 1: Resume Parser API Service
export class ResumeParserService {
  private baseUrl = '/v1/resume';

  // 1. Upload Resume Document
  async uploadResume(file: File): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiService.post<ResumeUploadResponse>(
      `${this.baseUrl}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // 2. Parse Resume
  async parseResume(
    resumeId: string,
    options: {
      extract_skills?: boolean;
      extract_experience?: boolean;
      extract_education?: boolean;
      extract_projects?: boolean;
      confidence_threshold?: number;
    } = {}
  ): Promise<ResumeParseResponse> {
    const response = await apiService.post<ResumeParseResponse>(
      `${this.baseUrl}/parse`,
      {
        resume_id: resumeId,
        parsing_options: {
          extract_skills: true,
          extract_experience: true,
          extract_education: true,
          extract_projects: true,
          confidence_threshold: 0.7,
          ...options,
        },
      }
    );
    return response.data;
  }

  // 3. Get Resume Details
  async getResumeDetails(resumeId: string): Promise<ResumeDetailsResponse> {
    const response = await apiService.get<ResumeDetailsResponse>(
      `${this.baseUrl}/${resumeId}`
    );
    return response.data;
  }

  // 4. Re-parse Resume
  async reparseResume(
    resumeId: string,
    options: ReparseOptions = {
      force_reparse: true,
      parsing_options: {
        extract_skills: true,
        extract_experience: true,
        extract_education: true,
        extract_projects: true,
        confidence_threshold: 0.8,
        use_latest_model: true,
      },
    }
  ): Promise<ResumeParseResponse> {
    const response = await apiService.post<ResumeParseResponse>(
      `${this.baseUrl}/${resumeId}/reparse`,
      options
    );
    return response.data;
  }

  // Helper method: Upload and parse in one go
  async uploadAndParseResume(
    file: File,
    parseOptions?: {
      extract_skills?: boolean;
      extract_experience?: boolean;
      extract_education?: boolean;
      extract_projects?: boolean;
      confidence_threshold?: number;
    }
  ): Promise<{ upload: ResumeUploadResponse; parse: ResumeParseResponse }> {
    const upload = await this.uploadResume(file);
    const parse = await this.parseResume(upload.data.resume_id, parseOptions);
    return { upload, parse };
  }

  // Helper method: Get parsing progress
  async getParsingProgress(resumeId: string): Promise<{
    status: 'uploading' | 'parsing' | 'completed' | 'failed';
    progress: number;
    message?: string;
  }> {
    try {
      const details = await this.getResumeDetails(resumeId);
      return {
        status: 'completed',
        progress: 100,
      };
    } catch (error) {
      return {
        status: 'failed',
        progress: 0,
        message: 'Failed to get parsing progress',
      };
    }
  }
}

export const resumeParserService = new ResumeParserService();
