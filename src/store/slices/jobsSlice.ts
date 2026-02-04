import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type Job } from '../../types';

interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    department?: string;
    type?: string;
    search?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: JobsState = {
  jobs: [],
  currentJob: null,
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
export const fetchJobsAsync = createAsyncThunk(
  'jobs/fetchJobs',
  async (params?: { page?: number; limit?: number; filters?: JobsState['filters'] }) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        description: 'We are looking for an experienced frontend developer...',
        department: 'Engineering',
        location: 'Remote',
        type: 'full-time',
        experience: '5+ years',
        salary: { min: 80000, max: 120000, currency: 'USD' },
        skills: ['React', 'TypeScript', 'CSS', 'Node.js'],
        postedBy: 'recruiter1',
        postedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'active',
        applicantCount: 45,
      },
      {
        id: '2',
        title: 'Product Manager',
        description: 'Join our product team to drive innovation...',
        department: 'Product',
        location: 'New York',
        type: 'full-time',
        experience: '3+ years',
        salary: { min: 90000, max: 130000, currency: 'USD' },
        skills: ['Product Strategy', 'Analytics', 'Communication'],
        postedBy: 'recruiter1',
        postedAt: new Date(Date.now() - 172800000).toISOString(),
        status: 'active',
        applicantCount: 32,
      },
    ];
    
    return {
      jobs: mockJobs,
      total: mockJobs.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  }
);

export const createJobAsync = createAsyncThunk(
  'jobs/createJob',
  async (jobData: Omit<Job, 'id' | 'postedBy' | 'postedAt' | 'applicantCount'>) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedBy: 'recruiter1',
      postedAt: new Date().toISOString(),
      applicantCount: 0,
    };
    
    return newJob;
  }
);

export const updateJobAsync = createAsyncThunk(
  'jobs/updateJob',
  async ({ jobId, jobData }: { jobId: string; jobData: Partial<Job> }) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { jobId, jobData };
  }
);

export const deleteJobAsync = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId: string) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return jobId;
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentJob: (state, action: PayloadAction<Job | null>) => {
      state.currentJob = action.payload;
    },
    setFilters: (state, action: PayloadAction<JobsState['filters']>) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setPagination: (state, action: PayloadAction<Partial<JobsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateJobStatus: (state, action: PayloadAction<{ jobId: string; status: Job['status'] }>) => {
      const { jobId, status } = action.payload;
      const job = state.jobs.find(j => j.id === jobId);
      if (job) {
        job.status = status;
      }
      if (state.currentJob?.id === jobId) {
        state.currentJob.status = status;
      }
    },
    incrementApplicantCount: (state, action: PayloadAction<string>) => {
      const jobId = action.payload;
      const job = state.jobs.find(j => j.id === jobId);
      if (job) {
        job.applicantCount += 1;
      }
      if (state.currentJob?.id === jobId) {
        state.currentJob.applicantCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs;
        state.pagination.total = action.payload.total;
        state.pagination.page = action.payload.page;
        state.pagination.limit = action.payload.limit;
      })
      .addCase(fetchJobsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      })
      // Create Job
      .addCase(createJobAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJobAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createJobAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create job';
      })
      // Update Job
      .addCase(updateJobAsync.fulfilled, (state, action) => {
        const { jobId, jobData } = action.payload;
        const jobIndex = state.jobs.findIndex(j => j.id === jobId);
        if (jobIndex !== -1) {
          state.jobs[jobIndex] = { ...state.jobs[jobIndex], ...jobData };
        }
        if (state.currentJob?.id === jobId) {
          state.currentJob = { ...state.currentJob, ...jobData };
        }
      })
      // Delete Job
      .addCase(deleteJobAsync.fulfilled, (state, action) => {
        const jobId = action.payload;
        state.jobs = state.jobs.filter(j => j.id !== jobId);
        state.pagination.total -= 1;
        if (state.currentJob?.id === jobId) {
          state.currentJob = null;
        }
      });
  },
});

export const {
  clearError,
  setCurrentJob,
  setFilters,
  clearFilters,
  setPagination,
  updateJobStatus,
  incrementApplicantCount,
} = jobsSlice.actions;

// Selectors
export const selectJobs = (state: { jobs: JobsState }) => state.jobs;
export const selectJobsList = (state: { jobs: JobsState }) => state.jobs.jobs;
export const selectCurrentJob = (state: { jobs: JobsState }) => state.jobs.currentJob;
export const selectJobsLoading = (state: { jobs: JobsState }) => state.jobs.isLoading;
export const selectJobsError = (state: { jobs: JobsState }) => state.jobs.error;
export const selectJobsFilters = (state: { jobs: JobsState }) => state.jobs.filters;
export const selectJobsPagination = (state: { jobs: JobsState }) => state.jobs.pagination;

// Memoized selectors
export const selectFilteredJobs = (state: { jobs: JobsState }) => {
  const { jobs, filters } = state.jobs;
  let filteredJobs = [...jobs];

  if (filters.status) {
    filteredJobs = filteredJobs.filter(job => job.status === filters.status);
  }
  if (filters.department) {
    filteredJobs = filteredJobs.filter(job => 
      job.department.toLowerCase().includes(filters.department!.toLowerCase())
    );
  }
  if (filters.type) {
    filteredJobs = filteredJobs.filter(job => job.type === filters.type);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  }

  return filteredJobs;
};

export default jobsSlice.reducer;
