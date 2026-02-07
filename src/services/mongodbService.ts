
// MongoDB Service - Direct Connection Implementation
// Note: This requires a backend API to handle MongoDB operations in production

export interface ResumeData {
  resume_id: string;
  candidate_id: string;
  filename: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
  upload_timestamp?: string;
  status: 'uploaded' | 'processing' | 'parsed' | 'error';
  parsed_data?: any;
  extraction_confidence?: number;
  processing_time_ms?: number;
  created_at?: string;
  updated_at?: string;
}

export interface InterviewSession {
  session_id: string;
  candidate_id: string;
  job_id: string;
  recruiter_id?: string;
  interview_mode: 'technical' | 'behavioral' | 'mixed';
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
  duration_minutes?: number;
  current_question_index?: number;
  total_questions?: number;
  config?: {
    difficulty_level: 'easy' | 'mid' | 'hard';
    focus_areas: string[];
    language: string;
    time_per_question: number;
  };
  overall_score?: number;
  created_at?: string;
  updated_at?: string;
}

// Mock implementation for browser compatibility
export class MongoDBService {
  private mockResumes: ResumeData[] = [
    {
      resume_id: 'res_001',
      candidate_id: 'cand_001',
      filename: 'john_doe_resume.pdf',
      status: 'parsed',
      parsed_data: {
        personal_info: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          location: 'New York, NY'
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      resume_id: 'res_002',
      candidate_id: 'cand_002',
      filename: 'jane_smith_resume.pdf',
      status: 'processing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  private mockInterviewSessions: InterviewSession[] = [
    {
      session_id: 'int_session_001',
      candidate_id: 'cand_001',
      job_id: 'job_001',
      interview_mode: 'mixed',
      status: 'completed',
      overall_score: 0.87,
      started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 45,
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    }
  ];

  async connect() {
    console.log('MongoDB Service: Connected (mock implementation)');
    return Promise.resolve();
  }

  // Module 1: Resume Operations
  async saveResume(resumeData: any) {
    const newResume: ResumeData = {
      resume_id: `res_${Date.now()}`,
      candidate_id: resumeData.candidate_id || `cand_${Date.now()}`,
      filename: resumeData.filename || 'unknown.pdf',
      status: 'uploaded',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...resumeData
    };
    this.mockResumes.push(newResume);
    return Promise.resolve({ insertedId: newResume.resume_id });
  }

  async getResume(resumeId: string) {
    const resume = this.mockResumes.find(r => r.resume_id === resumeId);
    return Promise.resolve(resume || null);
  }

  async getAllResumes() {
    return Promise.resolve([...this.mockResumes].sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    ));
  }

  async updateResumeStatus(resumeId: string, status: string) {
    const resume = this.mockResumes.find(r => r.resume_id === resumeId);
    if (resume) {
      resume.status = status as any;
      resume.updated_at = new Date().toISOString();
    }
    return Promise.resolve({ modifiedCount: resume ? 1 : 0 });
  }

  // Module 2: Interview Operations
  async createInterviewSession(sessionData: any) {
    const newSession: InterviewSession = {
      session_id: `int_session_${Date.now()}`,
      candidate_id: sessionData.candidate_id || `cand_${Date.now()}`,
      job_id: sessionData.job_id || `job_${Date.now()}`,
      interview_mode: sessionData.interview_mode || 'mixed',
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...sessionData
    };
    this.mockInterviewSessions.push(newSession);
    return Promise.resolve({ insertedId: newSession.session_id });
  }

  async getInterviewSession(sessionId: string) {
    const session = this.mockInterviewSessions.find(s => s.session_id === sessionId);
    return Promise.resolve(session || null);
  }

  async getAllInterviewSessions() {
    return Promise.resolve([...this.mockInterviewSessions].sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    ));
  }

  async saveInterviewAnswer(answerData: any) {
    console.log('Mock: Saving interview answer', answerData);
    return Promise.resolve({ insertedId: `ans_${Date.now()}` });
  }

  async saveInterviewFeedback(feedbackData: any) {
    console.log('Mock: Saving interview feedback', feedbackData);
    return Promise.resolve({ insertedId: `feedback_${Date.now()}` });
  }
}

export const mongoDBService = new MongoDBService();
 


