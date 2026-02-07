
// MongoDB Service - Mock Implementation for Browser Environment
// MongoDB driver is server-side only, so we use mock data for development

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

export class MongoDBService {
  // Mock data storage
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
    },
    {
      resume_id: 'res_003',
      candidate_id: 'cand_003',
      filename: 'mike_wilson_resume.docx',
      status: 'uploaded',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      resume_id: 'res_004',
      candidate_id: 'cand_004',
      filename: 'sarah_jones_resume.pdf',
      status: 'error',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
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
    },
    {
      session_id: 'int_session_002',
      candidate_id: 'cand_002',
      job_id: 'job_002',
      interview_mode: 'technical',
      status: 'active',
      started_at: new Date().toISOString(),
      duration_minutes: 30,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      session_id: 'int_session_003',
      candidate_id: 'cand_003',
      job_id: 'job_003',
      interview_mode: 'behavioral',
      status: 'scheduled',
      started_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 40,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      session_id: 'int_session_004',
      candidate_id: 'cand_004',
      job_id: 'job_004',
      interview_mode: 'mixed',
      status: 'completed',
      overall_score: 0.92,
      started_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 50,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Mock connection method
  async connect() {
    console.log('MongoDB Service: Using mock data for browser environment');
    return Promise.resolve();
  }

  // Module 1: Resume Operations
  async saveResume(resumeData: Partial<ResumeData>) {
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

  async getResume(resumeId: string): Promise<ResumeData | null> {
    const resume = this.mockResumes.find(r => r.resume_id === resumeId);
    return Promise.resolve(resume || null);
  }

  async getAllResumes(): Promise<ResumeData[]> {
    // Return sorted by created_at descending
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

  async deleteResume(resumeId: string) {
    const index = this.mockResumes.findIndex(r => r.resume_id === resumeId);
    if (index > -1) {
      this.mockResumes.splice(index, 1);
    }
    return Promise.resolve({ deletedCount: index > -1 ? 1 : 0 });
  }

  // Module 2: Interview Operations
  async createInterviewSession(sessionData: Partial<InterviewSession>) {
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

  async getInterviewSession(sessionId: string): Promise<InterviewSession | null> {
    const session = this.mockInterviewSessions.find(s => s.session_id === sessionId);
    return Promise.resolve(session || null);
  }

  async getAllInterviewSessions(): Promise<InterviewSession[]> {
    // Return sorted by created_at descending
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

  async updateInterviewSession(sessionId: string, updateData: Partial<InterviewSession>) {
    const session = this.mockInterviewSessions.find(s => s.session_id === sessionId);
    if (session) {
      Object.assign(session, updateData);
      session.updated_at = new Date().toISOString();
    }
    return Promise.resolve({ modifiedCount: session ? 1 : 0 });
  }

  // Analytics Operations
  async getResumeAnalytics() {
    const analytics = [
      { _id: 'uploaded', count: this.mockResumes.filter(r => r.status === 'uploaded').length },
      { _id: 'processing', count: this.mockResumes.filter(r => r.status === 'processing').length },
      { _id: 'parsed', count: this.mockResumes.filter(r => r.status === 'parsed').length },
      { _id: 'error', count: this.mockResumes.filter(r => r.status === 'error').length }
    ];
    return Promise.resolve(analytics);
  }

  async getInterviewAnalytics() {
    const completedSessions = this.mockInterviewSessions.filter(s => s.status === 'completed');
    const activeSessions = this.mockInterviewSessions.filter(s => s.status === 'active');
    const scheduledSessions = this.mockInterviewSessions.filter(s => s.status === 'scheduled');
    
    const analytics = [
      { _id: 'completed', count: completedSessions.length, avg_score: completedSessions.length > 0 ? completedSessions.reduce((acc, s) => acc + (s.overall_score || 0), 0) / completedSessions.length : 0 },
      { _id: 'active', count: activeSessions.length, avg_score: 0 },
      { _id: 'scheduled', count: scheduledSessions.length, avg_score: 0 }
    ];
    return Promise.resolve(analytics);
  }

  // Connection management
  async disconnect() {
    console.log('MongoDB Service: Mock disconnected');
    return Promise.resolve();
  }

  getDatabase() {
    return {
      collection: (name: string) => ({
        find: () => ({
          sort: () => ({
            toArray: () => {
              if (name === 'resumes') return Promise.resolve(this.mockResumes);
              if (name === 'interview_sessions') return Promise.resolve(this.mockInterviewSessions);
              return Promise.resolve([]);
            }
          })
        }),
        findOne: (query: any) => {
          if (name === 'resumes') return Promise.resolve(this.mockResumes.find(r => r.resume_id === query.resume_id) || null);
          if (name === 'interview_sessions') return Promise.resolve(this.mockInterviewSessions.find(s => s.session_id === query.session_id) || null);
          return Promise.resolve(null);
        },
        insertOne: (data: any) => {
          if (name === 'resumes') return this.saveResume(data);
          if (name === 'interview_sessions') return this.createInterviewSession(data);
          return Promise.resolve({ insertedId: Date.now().toString() });
        },
        updateOne: (query: any, update: any) => {
          if (name === 'resumes') return this.updateResumeStatus(query.resume_id, update.$set.status);
          if (name === 'interview_sessions') return this.updateInterviewSession(query.session_id, update.$set);
          return Promise.resolve({ modifiedCount: 0 });
        },
        deleteOne: (query: any) => {
          if (name === 'resumes') return this.deleteResume(query.resume_id);
          return Promise.resolve({ deletedCount: 0 });
        },
        aggregate: (pipeline: any) => {
          if (name === 'resumes') return this.getResumeAnalytics();
          if (name === 'interview_sessions') return this.getInterviewAnalytics();
          return Promise.resolve([]);
        }
      })
    };
  }
}

export const mongoDBService = new MongoDBService();
 


