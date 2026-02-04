import { apiService } from './apiService';
import { ParsedProfile } from './resumeParserService';

// Types for Module 2: Live AI Interview API
export interface InterviewStartRequest {
  resume_id: string;
  job_id: string;
  recruiter_custom_questions?: Array<{
    question: string;
    category: string;
    priority: string;
  }>;
  interview_mode: 'technical' | 'behavioral' | 'mixed';
  interview_config?: {
    duration_minutes?: number;
    difficulty_level?: 'junior' | 'mid' | 'senior' | 'executive';
    focus_areas?: string[];
    language?: string;
  };
}

export interface InterviewQuestion {
  question_id: string;
  type: 'technical' | 'behavioral' | 'problem_solving';
  question: string;
  expected_keywords?: string[];
  max_response_time: number;
  follow_up_suggestions?: string[];
  context?: string;
  evaluation_criteria?: string[];
}

export interface InterviewStartResponse {
  success: boolean;
  data: {
    session_id: string;
    candidate_profile: {
      name: string;
      experience_years: number;
      key_skills: string[];
      current_role: string;
    };
    interview_plan: {
      total_questions: number;
      estimated_duration: string;
      categories: {
        technical: number;
        behavioral: number;
        problem_solving: number;
      };
    };
    first_question: InterviewQuestion;
    session_status: string;
    started_at: string;
  };
}

export interface AnswerSubmission {
  session_id: string;
  question_id: string;
  transcript: string;
  response_metadata?: {
    response_time_seconds: number;
    audio_quality_score?: number;
    speech_clarity_score?: number;
  };
}

export interface AnswerEvaluation {
  overall_score: number;
  scores: {
    relevance: number;
    depth: number;
    clarity: number;
    technical_accuracy?: number;
  };
  strengths: string[];
  areas_for_improvement: string[];
  key_insights: string[];
}

export interface AnswerResponse {
  success: boolean;
  data: {
    session_id: string;
    question_id: string;
    evaluation: AnswerEvaluation;
    next_action: 'continue' | 'finish' | 'repeat';
    next_question?: InterviewQuestion;
    session_progress: {
      questions_completed: number;
      total_questions: number;
      time_elapsed_minutes: number;
      estimated_remaining_minutes: number;
    };
  };
}

export interface NextQuestionResponse {
  success: boolean;
  data: {
    session_id: string;
    question: InterviewQuestion;
    session_context: {
      current_category: string;
      adaptive_difficulty: string;
      candidate_performance_trend: string;
    };
  };
}

export interface RepeatQuestionResponse {
  success: boolean;
  data: {
    session_id: string;
    question: InterviewQuestion & {
      audio_url?: string;
      text_display: boolean;
      repeat_count: number;
    };
    session_status: string;
  };
}

export interface InterviewFinishRequest {
  session_id: string;
  finish_reason: 'completed' | 'timeout' | 'manual';
  candidate_notes?: string;
}

export interface InterviewFinishResponse {
  success: boolean;
  data: {
    session_id: string;
    session_summary: {
      duration_minutes: number;
      questions_completed: number;
      questions_skipped: number;
      overall_score: number;
      finished_at: string;
    };
    preliminary_results: {
      technical_score: number;
      behavioral_score: number;
      communication_score: number;
      problem_solving_score: number;
    };
    report_id: string;
    report_status: string;
  };
  message: string;
}

export interface InterviewReport {
  report_id: string;
  session_id: string;
  candidate_info: {
    name: string;
    resume_id: string;
    job_id: string;
    interview_date: string;
  };
  overall_assessment: {
    final_score: number;
    recommendation: 'strong_hire' | 'hire' | 'consider' | 'reject';
    confidence_level: number;
    summary: string;
  };
  detailed_scores: {
    technical_skills: {
      score: number;
      breakdown: {
        programming: number;
        architecture: number;
        debugging: number;
        tools: number;
      };
      strengths: string[];
      weaknesses: string[];
    };
    behavioral_skills: {
      score: number;
      breakdown: {
        teamwork: number;
        leadership: number;
        communication: number;
        problem_solving: number;
      };
      strengths: string[];
      areas_for_improvement: string[];
    };
    communication: {
      score: number;
      clarity: number;
      conciseness: number;
      professionalism: number;
    };
  };
  question_analysis: Array<{
    question_id: string;
    question: string;
    answer_summary: string;
    score: number;
    key_points: string[];
    red_flags: string[];
  }>;
  strengths: string[];
  weaknesses: string[];
  red_flags: string[];
  full_transcript: {
    total_duration_minutes: number;
    word_count: number;
    questions_count: number;
    transcript_url: string;
  };
  recommendations: {
    next_steps: string[];
    salary_range?: string;
    fit_score: number;
  };
  generated_at: string;
}

export interface InterviewReportResponse {
  success: boolean;
  data: InterviewReport;
}

// Module 2: Live AI Interview API Service
export class InterviewService {
  private baseUrl = '/v1/interview/live';

  // 1. Start Live Interview
  async startInterview(request: InterviewStartRequest): Promise<InterviewStartResponse> {
    const response = await apiService.post<InterviewStartResponse>(
      `${this.baseUrl}/start`,
      request
    );
    return response.data;
  }

  // 2. Submit Answer
  async submitAnswer(submission: AnswerSubmission): Promise<AnswerResponse> {
    const response = await apiService.post<AnswerResponse>(
      `${this.baseUrl}/answer`,
      submission
    );
    return response.data;
  }

  // 3. Get Next Question
  async getNextQuestion(
    sessionId: string,
    forceNext: boolean = false
  ): Promise<NextQuestionResponse> {
    const response = await apiService.post<NextQuestionResponse>(
      `${this.baseUrl}/next`,
      { session_id: sessionId, force_next: forceNext }
    );
    return response.data;
  }

  // 4. Repeat Current Question
  async repeatQuestion(
    sessionId: string,
    questionId: string
  ): Promise<RepeatQuestionResponse> {
    const response = await apiService.post<RepeatQuestionResponse>(
      `${this.baseUrl}/repeat`,
      { session_id: sessionId, question_id: questionId }
    );
    return response.data;
  }

  // 5. Finish Interview
  async finishInterview(request: InterviewFinishRequest): Promise<InterviewFinishResponse> {
    const response = await apiService.post<InterviewFinishResponse>(
      `${this.baseUrl}/finish`,
      request
    );
    return response.data;
  }

  // 6. Get Interview Report
  async getInterviewReport(sessionId: string): Promise<InterviewReportResponse> {
    const response = await apiService.get<InterviewReportResponse>(
      `${this.baseUrl}/${sessionId}/report`
    );
    return response.data;
  }

  // Helper method: Get session status
  async getSessionStatus(sessionId: string): Promise<{
    session_id: string;
    status: 'active' | 'completed' | 'paused' | 'expired';
    current_question_id?: string;
    progress: {
      questions_completed: number;
      total_questions: number;
      time_elapsed_minutes: number;
    };
  }> {
    try {
      const report = await this.getInterviewReport(sessionId);
      return {
        session_id: sessionId,
        status: 'completed',
        progress: {
          questions_completed: report.data.full_transcript.questions_count,
          total_questions: report.data.full_transcript.questions_count,
          time_elapsed_minutes: report.data.full_transcript.total_duration_minutes,
        },
      };
    } catch (error) {
      // If report doesn't exist, session might still be active
      return {
        session_id: sessionId,
        status: 'active',
        progress: {
          questions_completed: 0,
          total_questions: 0,
          time_elapsed_minutes: 0,
        },
      };
    }
  }

  // Helper method: Start interview with resume parsing
  async startInterviewWithResume(
    resumeFile: File,
    jobId: string,
    interviewOptions: Omit<InterviewStartRequest, 'resume_id'>
  ): Promise<{ upload: any; parse: any; interview: InterviewStartResponse }> {
    // This would integrate with resume parser service
    // For now, return mock structure
    const interview = await this.startInterview({
      ...interviewOptions,
      resume_id: 'temp_resume_id',
      job_id: jobId,
    });

    return {
      upload: { resume_id: 'temp_resume_id' },
      parse: { parsed_profile: {} },
      interview,
    };
  }

  // Helper method: Get interview analytics for dashboard
  async getInterviewAnalytics(filters?: {
    date_from?: string;
    date_to?: string;
    job_id?: string;
    status?: string;
  }): Promise<{
    total_interviews: number;
    completed_interviews: number;
    average_score: number;
    average_duration: number;
    completion_rate: number;
    scores_by_category: {
      technical: number;
      behavioral: number;
      communication: number;
    };
  }> {
    // Mock implementation - would call actual analytics endpoint
    return {
      total_interviews: 150,
      completed_interviews: 120,
      average_score: 7.8,
      average_duration: 42,
      completion_rate: 80,
      scores_by_category: {
        technical: 8.2,
        behavioral: 7.5,
        communication: 7.8,
      },
    };
  }
}

export const interviewService = new InterviewService();
