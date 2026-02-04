import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type InterviewSession, type InterviewStatus } from '../../types';

interface InterviewsState {
  sessions: InterviewSession[];
  currentSession: InterviewSession | null;
  isLoading: boolean;
  error: string | null;
  liveInterviews: string[]; // Session IDs of live interviews
  transcript: Array<{
    timestamp: string;
    speaker: 'interviewer' | 'candidate';
    text: string;
  }>;
  feedback: {
    technical: number;
    communication: number;
    overall: number;
    comments: string;
  } | null;
}

const initialState: InterviewsState = {
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
  liveInterviews: [],
  transcript: [],
  feedback: null,
};

// Async thunks
export const fetchInterviewSessionsAsync = createAsyncThunk(
  'interviews/fetchSessions',
  async (filters?: { status?: InterviewStatus; candidateId?: string; jobId?: string }) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockSessions: InterviewSession[] = [
      {
        id: '1',
        jobId: 'job1',
        candidateId: 'candidate1',
        recruiterId: 'recruiter1',
        scheduledAt: new Date().toISOString(),
        duration: 60,
        status: 'READY',
        meetingLink: 'https://meet.example.com/123',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        jobId: 'job2',
        candidateId: 'candidate2',
        recruiterId: 'recruiter1',
        scheduledAt: new Date(Date.now() + 3600000).toISOString(),
        duration: 45,
        status: 'LIVE',
        meetingLink: 'https://meet.example.com/456',
        createdAt: new Date().toISOString(),
      },
    ];
    
    return mockSessions;
  }
);

export const startInterviewSessionAsync = createAsyncThunk(
  'interviews/startSession',
  async ({ candidateId, jobId }: { candidateId: string; jobId: string }) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newSession: InterviewSession = {
      id: `session-${Date.now()}`,
      candidateId,
      jobId,
      recruiterId: 'recruiter1',
      scheduledAt: new Date().toISOString(),
      duration: 60,
      status: 'LIVE',
      meetingLink: `https://meet.example.com/${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    return newSession;
  }
);

export const submitInterviewAnswerAsync = createAsyncThunk(
  'interviews/submitAnswer',
  async ({ sessionId, answer }: { sessionId: string; answer: string }) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { sessionId, answer, timestamp: new Date().toISOString() };
  }
);

export const endInterviewSessionAsync = createAsyncThunk(
  'interviews/endSession',
  async (sessionId: string) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return sessionId;
  }
);

export const fetchInterviewFeedbackAsync = createAsyncThunk(
  'interviews/fetchFeedback',
  async (sessionId: string) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockFeedback = {
      technical: 85,
      communication: 78,
      overall: 82,
      comments: 'Strong technical skills, good communication. Would recommend for next round.',
    };
    
    return { sessionId, feedback: mockFeedback };
  }
);

export const fetchInterviewTranscriptAsync = createAsyncThunk(
  'interviews/fetchTranscript',
  async (sessionId: string) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTranscript = [
      {
        timestamp: '10:00:00',
        speaker: 'interviewer' as const,
        text: 'Hello! Can you tell me about your experience with React?',
      },
      {
        timestamp: '10:00:15',
        speaker: 'candidate' as const,
        text: 'Hi! I have been working with React for the past 3 years...',
      },
    ];
    
    return { sessionId, transcript: mockTranscript };
  }
);

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSession: (state, action: PayloadAction<InterviewSession | null>) => {
      state.currentSession = action.payload;
    },
    updateSessionStatus: (state, action: PayloadAction<{ sessionId: string; status: InterviewStatus }>) => {
      const { sessionId, status } = action.payload;
      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
        session.status = status;
      }
      if (state.currentSession?.id === sessionId) {
        state.currentSession.status = status;
      }
      
      // Update live interviews list
      if (status === 'LIVE') {
        state.liveInterviews.push(sessionId);
      } else {
        state.liveInterviews = state.liveInterviews.filter(id => id !== sessionId);
      }
    },
    addTranscriptMessage: (state, action: PayloadAction<{
      sessionId: string;
      speaker: 'interviewer' | 'candidate';
      text: string;
    }>) => {
      const { sessionId, speaker, text } = action.payload;
      if (state.currentSession?.id === sessionId) {
        state.transcript.push({
          timestamp: new Date().toISOString(),
          speaker,
          text,
        });
      }
    },
    clearTranscript: (state) => {
      state.transcript = [];
    },
    clearFeedback: (state) => {
      state.feedback = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sessions
      .addCase(fetchInterviewSessionsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInterviewSessionsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
        state.liveInterviews = action.payload
          .filter(session => session.status === 'LIVE')
          .map(session => session.id);
      })
      .addCase(fetchInterviewSessionsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch interview sessions';
      })
      // Start Session
      .addCase(startInterviewSessionAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startInterviewSessionAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.sessions.push(action.payload);
        state.liveInterviews.push(action.payload.id);
        state.transcript = [];
        state.feedback = null;
      })
      .addCase(startInterviewSessionAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to start interview session';
      })
      // Submit Answer
      .addCase(submitInterviewAnswerAsync.fulfilled, (state, action) => {
        const { sessionId, answer, timestamp } = action.payload;
        if (state.currentSession?.id === sessionId) {
          state.transcript.push({
            timestamp,
            speaker: 'candidate',
            text: answer,
          });
        }
      })
      // End Session
      .addCase(endInterviewSessionAsync.fulfilled, (state, action) => {
        const sessionId = action.payload;
        state.liveInterviews = state.liveInterviews.filter(id => id !== sessionId);
        
        const session = state.sessions.find(s => s.id === sessionId);
        if (session) {
          session.status = 'COMPLETED';
        }
        if (state.currentSession?.id === sessionId) {
          state.currentSession.status = 'COMPLETED';
        }
      })
      // Fetch Feedback
      .addCase(fetchInterviewFeedbackAsync.fulfilled, (state, action) => {
        const { feedback } = action.payload;
        state.feedback = feedback;
      })
      // Fetch Transcript
      .addCase(fetchInterviewTranscriptAsync.fulfilled, (state, action) => {
        const { transcript } = action.payload;
        state.transcript = transcript;
      });
  },
});

export const {
  clearError,
  setCurrentSession,
  updateSessionStatus,
  addTranscriptMessage,
  clearTranscript,
  clearFeedback,
} = interviewsSlice.actions;

// Selectors
export const selectInterviews = (state: { interviews: InterviewsState }) => state.interviews;
export const selectInterviewSessions = (state: { interviews: InterviewsState }) => state.interviews.sessions;
export const selectCurrentSession = (state: { interviews: InterviewsState }) => state.interviews.currentSession;
export const selectLiveInterviews = (state: { interviews: InterviewsState }) => state.interviews.liveInterviews;
export const selectInterviewTranscript = (state: { interviews: InterviewsState }) => state.interviews.transcript;
export const selectInterviewFeedback = (state: { interviews: InterviewsState }) => state.interviews.feedback;
export const selectInterviewsLoading = (state: { interviews: InterviewsState }) => state.interviews.isLoading;
export const selectInterviewsError = (state: { interviews: InterviewsState }) => state.interviews.error;

export default interviewsSlice.reducer;
