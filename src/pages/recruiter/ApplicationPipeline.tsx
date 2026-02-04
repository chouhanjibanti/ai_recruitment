import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidatesAsync, updateCandidateStatus } from '../../store/slices/candidatesSlice';
import { fetchJobsAsync } from '../../store/slices/jobsSlice';
import { selectCandidatesList, selectCandidatesLoading } from '../../store/slices/candidatesSlice';
import { selectJobsList } from '../../store/slices/jobsSlice';
import { type Candidate, type Job } from '../../types';
import { Users, FileText, Calendar, CheckCircle, XCircle, Clock, Eye, MessageSquare, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  candidate: Candidate;
  job: Job;
  status: 'applied' | 'screening' | 'interview' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
  resumeParsed?: boolean;
  interviewScheduled?: boolean;
  notes?: string;
}

const ApplicationPipeline: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const candidates = useSelector(selectCandidatesList);
  const jobs = useSelector(selectJobsList);
  const isLoading = useSelector(selectCandidatesLoading);
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState({
    status: '',
    jobId: '',
    search: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock applications data
  useEffect(() => {
    dispatch(fetchCandidatesAsync());
    dispatch(fetchJobsAsync());
    
    // Generate mock applications
    const mockApplications: Application[] = [
      {
        id: '1',
        candidate: candidates[0] || {} as Candidate,
        job: jobs[0] || {} as Job,
        status: 'interview',
        appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        resumeParsed: true,
        interviewScheduled: true,
        notes: 'Strong technical skills, good communication',
      },
      {
        id: '2',
        candidate: candidates[1] || {} as Candidate,
        job: jobs[0] || {} as Job,
        status: 'screening',
        appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        resumeParsed: true,
        interviewScheduled: false,
        notes: 'Needs technical assessment',
      },
    ];
    
    setApplications(mockApplications);
  }, [candidates, jobs, dispatch]);

  const handleStatusUpdate = (applicationId: string, newStatus: Application['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
    
    // Update candidate status in Redux
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      dispatch(updateCandidateStatus({
        candidateId: application.candidate.id,
        status: newStatus === 'hired' ? 'available' : newStatus === 'rejected' ? 'available' : 'interviewing'
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-gray-100 text-gray-800';
      case 'screening': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <FileText className="w-4 h-4" />;
      case 'screening': return <Clock className="w-4 h-4" />;
      case 'interview': return <Calendar className="w-4 h-4" />;
      case 'shortlisted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'hired': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter.status && app.status !== filter.status) return false;
    if (filter.jobId && app.job.id !== filter.jobId) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.candidate.name.toLowerCase().includes(searchLower) ||
        app.candidate.email.toLowerCase().includes(searchLower) ||
        app.job.title.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const pipelineStages = [
    { id: 'applied', name: 'Applied', count: applications.filter(a => a.status === 'applied').length },
    { id: 'screening', name: 'Screening', count: applications.filter(a => a.status === 'screening').length },
    { id: 'interview', name: 'Interview', count: applications.filter(a => a.status === 'interview').length },
    { id: 'shortlisted', name: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
    { id: 'rejected', name: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
    { id: 'hired', name: 'Hired', count: applications.filter(a => a.status === 'hired').length },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Application Pipeline</h1>
        <p className="text-gray-600">Track and manage candidate applications through the hiring process</p>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {pipelineStages.map((stage) => (
          <div
            key={stage.id}
            className="bg-white rounded-lg shadow p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setFilter(prev => ({ ...prev, status: prev.status === stage.id ? '' : stage.id }))}
          >
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${getStatusColor(stage.id)}`}>
              {getStatusIcon(stage.id)}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stage.count}</div>
            <div className="text-sm text-gray-600">{stage.name}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates, jobs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filter.jobId}
              onChange={(e) => setFilter(prev => ({ ...prev, jobId: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Jobs</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
          
          <button
            onClick={() => setFilter({ status: '', jobId: '', search: '' })}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.candidate.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.candidate.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.job.title}</div>
                    <div className="text-sm text-gray-500">{application.job.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{application.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.resumeParsed ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">
                        Parsed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.interviewScheduled ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded">
                        Scheduled
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/recruiter/candidates/${application.candidate.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/recruiter/applications/${application.id}`)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusUpdate(application.id, e.target.value as Application['status'])}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="applied">Applied</option>
                        <option value="screening">Screening</option>
                        <option value="interview">Interview</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationPipeline;
