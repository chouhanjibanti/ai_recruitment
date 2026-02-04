export type UserRole = 'admin' | 'recruiter' | 'candidate';

export type InterviewStatus = 'READY' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  postedBy: string;
  postedAt: string;
  status: 'active' | 'closed' | 'draft';
  applicantCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  resume?: string;
  experience: number;
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  currentStatus: 'available' | 'employed' | 'interviewing' | 'offered';
  expectedSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  preferredLocation: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InterviewSession {
  id: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  scheduledAt: string;
  duration: number;
  status: InterviewStatus;
  meetingLink?: string;
  notes?: string;
  feedback?: {
    technical: number;
    communication: number;
    overall: number;
    comments: string;
  };
  createdAt: string;
}

export interface Pipeline {
  id: string;
  name: string;
  jobId: string;
  stages: {
    id: string;
    name: string;
    order: number;
    candidates: string[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'hiring' | 'performance' | 'pipeline' | 'interview';
  data: Record<string, any>;
  generatedAt: string;
  generatedBy: string;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  activeCandidates: number;
  scheduledInterviews: number;
  completedInterviews: number;
  averageTimeToHire: number;
  offerAcceptanceRate: number;
}
