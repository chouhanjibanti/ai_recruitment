import { useState, useCallback, useEffect } from 'react';
import { 
  interviewService, 
  InterviewStartResponse, 
  AnswerResponse, 
  InterviewReport,
  InterviewStartRequest 
} from '../services/interviewService';

export interface InterviewSession {
  session_id: string;
  candidate_profile: {
    name: string;
    experience_years: number;
    key_skills: string[];
    current_role: string;
  };
  current_question?: any;
  progress: {
    questions_completed: number;
    total_questions: number;
    time_elapsed_minutes: number;
    estimated_remaining_minutes: number;
  };
  status: 'active' | 'completed' | 'paused' | 'expired';
  started_at: string;
}

export interface UseInterviewState {
  session: InterviewSession | null;
  loading: boolean;
  submitting: boolean;
  currentAnswer: string;
  evaluation: any;
  report: InterviewReport | null;
  error: string | null;
}

export const useInterview = (sessionId?: string) => {
  const [state, setState] = useState<UseInterviewState>({
    session: null,
    loading: false,
    submitting: false,
    currentAnswer: '',
    evaluation: null,
    report: null,
    error: null,
  });

  const resetState = useCallback(() => {
    setState({
      session: null,
      loading: false,
      submitting: false,
      currentAnswer: '',
      evaluation: null,
      report: null,
      error: null,
    });
  }, []);

  const startInterview = useCallback(async (request: InterviewStartRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await interviewService.startInterview(request);
      
      const session: InterviewSession = {
        session_id: response.data.session_id,
        candidate_profile: response.data.candidate_profile,
        current_question: response.data.first_question,
        progress: {
          questions_completed: 0,
          total_questions: response.data.interview_plan.total_questions,
          time_elapsed_minutes: 0,
          estimated_remaining_minutes: parseInt(response.data.interview_plan.estimated_duration),
        },
        status: 'active',
        started_at: response.data.started_at,
      };

      setState(prev => ({ 
        ...prev, 
        loading: false, 
        session,
        currentAnswer: ''
      }));
      
      return response;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.error?.message || 'Failed to start interview' 
      }));
      throw error;
    }
  }, []);

  const submitAnswer = useCallback(async (answer: string, questionId: string) => {
    if (!state.session) return;

    setState(prev => ({ 
      ...prev, 
      submitting: true, 
      currentAnswer: answer,
      error: null 
    }));

    try {
      const response = await interviewService.submitAnswer({
        session_id: state.session.session_id,
        question_id: questionId,
        transcript: answer,
        response_metadata: {
          response_time_seconds: 60, // Would be calculated from actual timing
        },
      });

      setState(prev => ({ 
        ...prev, 
        submitting: false, 
        evaluation: response.data.evaluation,
        session: prev.session ? {
          ...prev.session,
          current_question: response.data.next_question,
          progress: response.data.session_progress,
          status: response.data.next_action === 'finish' ? 'completed' : 'active',
        } : null,
        currentAnswer: ''
      }));

      return response;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        submitting: false, 
        error: error.response?.data?.error?.message || 'Failed to submit answer' 
      }));
      throw error;
    }
  }, [state.session]);

  const getNextQuestion = useCallback(async (forceNext: boolean = false) => {
    if (!state.session) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await interviewService.getNextQuestion(state.session.session_id, forceNext);
      
      setState(prev => ({ 
        ...prev, 
        loading: false,
        session: prev.session ? {
          ...prev.session,
          current_question: response.data.question,
        } : null,
      }));

      return response;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.error?.message || 'Failed to get next question' 
      }));
      throw error;
    }
  }, [state.session]);

  const repeatQuestion = useCallback(async (questionId: string) => {
    if (!state.session) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await interviewService.repeatQuestion(state.session.session_id, questionId);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.error?.message || 'Failed to repeat question' 
      }));
      throw error;
    }
  }, [state.session]);

  const finishInterview = useCallback(async (finishReason: 'completed' | 'timeout' | 'manual' = 'completed', candidateNotes?: string) => {
    if (!state.session) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await interviewService.finishInterview({
        session_id: state.session.session_id,
        finish_reason: finishReason,
        candidate_notes: candidateNotes,
      });

      setState(prev => ({ 
        ...prev, 
        loading: false,
        session: prev.session ? {
          ...prev.session,
          status: 'completed',
        } : null,
      }));

      return response;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.error?.message || 'Failed to finish interview' 
      }));
      throw error;
    }
  }, [state.session]);

  const getInterviewReport = useCallback(async (sessionIdToGet?: string) => {
    const targetSessionId = sessionIdToGet || state.session?.session_id;
    if (!targetSessionId) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await interviewService.getInterviewReport(targetSessionId);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        report: response.data
      }));
      return response;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.error?.message || 'Failed to get interview report' 
      }));
      throw error;
    }
  }, [state.session]);

  // Auto-load session if sessionId is provided
  useEffect(() => {
    if (sessionId && !state.session) {
      getInterviewReport(sessionId);
    }
  }, [sessionId, state.session, getInterviewReport]);

  return {
    ...state,
    startInterview,
    submitAnswer,
    getNextQuestion,
    repeatQuestion,
    finishInterview,
    getInterviewReport,
    resetState,
    setCurrentAnswer: (answer: string) => setState(prev => ({ ...prev, currentAnswer: answer })),
  };
};
