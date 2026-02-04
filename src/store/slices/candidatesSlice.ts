import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type Candidate } from '../../types';

interface CandidatesState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    skills?: string[];
    experience?: string;
    search?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: CandidatesState = {
  candidates: [],
  currentCandidate: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Async thunks
export const fetchCandidatesAsync = createAsyncThunk(
  'candidates/fetchCandidates',
  async (params?: { page?: number; limit?: number; filters?: CandidatesState['filters'] }) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1-555-0123',
        experience: 5,
        skills: ['React', 'TypeScript', 'Node.js', 'Python'],
        education: [
          { degree: 'BS Computer Science', institution: 'MIT', year: '2018' },
        ],
        currentStatus: 'available',
        expectedSalary: { min: 80000, max: 120000, currency: 'USD' },
        preferredLocation: ['Remote', 'New York', 'San Francisco'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+1-555-0124',
        experience: 3,
        skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML'],
        education: [
          { degree: 'BA Web Development', institution: 'Stanford', year: '2020' },
        ],
        currentStatus: 'interviewing',
        expectedSalary: { min: 60000, max: 80000, currency: 'USD' },
        preferredLocation: ['Remote', 'Austin'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    return {
      candidates: mockCandidates,
      total: mockCandidates.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  }
);

export const createCandidateAsync = createAsyncThunk(
  'candidates/createCandidate',
  async (candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCandidate: Candidate = {
      ...candidateData,
      id: `candidate-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newCandidate;
  }
);

export const updateCandidateAsync = createAsyncThunk(
  'candidates/updateCandidate',
  async ({ candidateId, candidateData }: { candidateId: string; candidateData: Partial<Candidate> }) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { candidateId, candidateData };
  }
);

export const deleteCandidateAsync = createAsyncThunk(
  'candidates/deleteCandidate',
  async (candidateId: string) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return candidateId;
  }
);

export const uploadResumeAsync = createAsyncThunk(
  'candidates/uploadResume',
  async ({ candidateId, file }: { candidateId: string; file: File }) => {
    // Mock file upload - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      candidateId,
      resumeUrl: `https://storage.example.com/resumes/${candidateId}/${file.name}`,
      fileName: file.name,
    };
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.currentCandidate = action.payload;
    },
    setFilters: (state, action: PayloadAction<CandidatesState['filters']>) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setPagination: (state, action: PayloadAction<Partial<CandidatesState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateCandidateStatus: (state, action: PayloadAction<{ candidateId: string; status: Candidate['currentStatus'] }>) => {
      const { candidateId, status } = action.payload;
      const candidate = state.candidates.find(c => c.id === candidateId);
      if (candidate) {
        candidate.currentStatus = status;
        candidate.updatedAt = new Date().toISOString();
      }
      if (state.currentCandidate?.id === candidateId) {
        state.currentCandidate.currentStatus = status;
        state.currentCandidate.updatedAt = new Date().toISOString();
      }
    },
    addSkillToCandidate: (state, action: PayloadAction<{ candidateId: string; skill: string }>) => {
      const { candidateId, skill } = action.payload;
      const candidate = state.candidates.find(c => c.id === candidateId);
      if (candidate && !candidate.skills.includes(skill)) {
        candidate.skills.push(skill);
        candidate.updatedAt = new Date().toISOString();
      }
      if (state.currentCandidate?.id === candidateId && !state.currentCandidate.skills.includes(skill)) {
        state.currentCandidate.skills.push(skill);
        state.currentCandidate.updatedAt = new Date().toISOString();
      }
    },
    removeSkillFromCandidate: (state, action: PayloadAction<{ candidateId: string; skill: string }>) => {
      const { candidateId, skill } = action.payload;
      const candidate = state.candidates.find(c => c.id === candidateId);
      if (candidate) {
        candidate.skills = candidate.skills.filter(s => s !== skill);
        candidate.updatedAt = new Date().toISOString();
      }
      if (state.currentCandidate?.id === candidateId) {
        state.currentCandidate.skills = state.currentCandidate.skills.filter(s => s !== skill);
        state.currentCandidate.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Candidates
      .addCase(fetchCandidatesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidatesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.candidates = action.payload.candidates;
        state.pagination.total = action.payload.total;
        state.pagination.page = action.payload.page;
        state.pagination.limit = action.payload.limit;
      })
      .addCase(fetchCandidatesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch candidates';
      })
      // Create Candidate
      .addCase(createCandidateAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCandidateAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.candidates.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createCandidateAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create candidate';
      })
      // Update Candidate
      .addCase(updateCandidateAsync.fulfilled, (state, action) => {
        const { candidateId, candidateData } = action.payload;
        const candidateIndex = state.candidates.findIndex(c => c.id === candidateId);
        if (candidateIndex !== -1) {
          state.candidates[candidateIndex] = { 
            ...state.candidates[candidateIndex], 
            ...candidateData,
            updatedAt: new Date().toISOString(),
          };
        }
        if (state.currentCandidate?.id === candidateId) {
          state.currentCandidate = { 
            ...state.currentCandidate, 
            ...candidateData,
            updatedAt: new Date().toISOString(),
          };
        }
      })
      // Delete Candidate
      .addCase(deleteCandidateAsync.fulfilled, (state, action) => {
        const candidateId = action.payload;
        state.candidates = state.candidates.filter(c => c.id !== candidateId);
        state.pagination.total -= 1;
        if (state.currentCandidate?.id === candidateId) {
          state.currentCandidate = null;
        }
      })
      // Upload Resume
      .addCase(uploadResumeAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadResumeAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const { candidateId, resumeUrl, fileName } = action.payload;
        const candidate = state.candidates.find(c => c.id === candidateId);
        if (candidate) {
          candidate.resume = resumeUrl;
          candidate.updatedAt = new Date().toISOString();
        }
        if (state.currentCandidate?.id === candidateId) {
          state.currentCandidate.resume = resumeUrl;
          state.currentCandidate.updatedAt = new Date().toISOString();
        }
      })
      .addCase(uploadResumeAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to upload resume';
      });
  },
});

export const {
  clearError,
  setCurrentCandidate,
  setFilters,
  clearFilters,
  setPagination,
  updateCandidateStatus,
  addSkillToCandidate,
  removeSkillFromCandidate,
} = candidatesSlice.actions;

// Selectors
export const selectCandidates = (state: { candidates: CandidatesState }) => state.candidates;
export const selectCandidatesList = (state: { candidates: CandidatesState }) => state.candidates.candidates;
export const selectCurrentCandidate = (state: { candidates: CandidatesState }) => state.candidates.currentCandidate;
export const selectCandidatesLoading = (state: { candidates: CandidatesState }) => state.candidates.isLoading;
export const selectCandidatesError = (state: { candidates: CandidatesState }) => state.candidates.error;
export const selectCandidatesFilters = (state: { candidates: CandidatesState }) => state.candidates.filters;
export const selectCandidatesPagination = (state: { candidates: CandidatesState }) => state.candidates.pagination;

// Memoized selectors
export const selectFilteredCandidates = (state: { candidates: CandidatesState }) => {
  const { candidates, filters } = state.candidates;
  let filteredCandidates = [...candidates];

  if (filters.status) {
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.currentStatus === filters.status
    );
  }
  if (filters.skills && filters.skills.length > 0) {
    filteredCandidates = filteredCandidates.filter(candidate =>
      filters.skills!.some(skill => candidate.skills.includes(skill))
    );
  }
  if (filters.experience) {
    filteredCandidates = filteredCandidates.filter(candidate =>
      candidate.experience >= parseInt(filters.experience!)
    );
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredCandidates = filteredCandidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchLower) ||
      candidate.email.toLowerCase().includes(searchLower) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  }

  return filteredCandidates;
};

export default candidatesSlice.reducer;
