import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, Clock, Eye, MessageSquare, Filter, Search, CheckCircle, XCircle, AlertCircle, TrendingUp, FileText, MapPin, DollarSign } from 'lucide-react';
import { selectUser } from '../../store/slices/authSlice';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  department: string;
  type: string;
  salary: {
    currency: string;
    min: number;
    max: number;
  };
  status: 'applied' | 'screening' | 'interview' | 'shortlisted' | 'rejected' | 'hired' | 'withdrawn';
  appliedAt: string;
  lastUpdated: string;
  resumeUrl?: string;
  coverLetter?: string;
  notes?: string;
  interviewDates?: Array<{
    type: string;
    date: string;
    time: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }>;
  feedback?: Array<{
    date: string;
    message: string;
    type: 'system' | 'recruiter';
  }>;
  matchScore?: number;
  skillsMatch?: string[];
}

const ApplicationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'company'>('date');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockApplications: Application[] = [
      {
        id: '1',
        jobId: 'job1',
        jobTitle: 'Senior Frontend Developer',
        company: 'TechCorp Solutions',
        location: 'San Francisco, CA',
        department: 'Engineering',
        type: 'full-time',
        salary: {
          currency: 'USD',
          min: 120000,
          max: 180000,
        },
        status: 'interview',
        appliedAt: '2024-01-15T10:30:00Z',
        lastUpdated: '2024-01-20T14:15:00Z',
        resumeUrl: '/resumes/john_doe_resume.pdf',
        coverLetter: 'I am excited to apply for this position...',
        notes: 'Strong technical skills, good cultural fit',
        interviewDates: [
          {
            type: 'Technical Interview',
            date: '2024-01-25',
            time: '14:00',
            status: 'scheduled',
          },
        ],
        feedback: [
          {
            date: '2024-01-20T14:15:00Z',
            message: 'Application moved to interview stage',
            type: 'system',
          },
        ],
        matchScore: 85,
        skillsMatch: ['React', 'TypeScript', 'Node.js'],
      },
      {
        id: '2',
        jobId: 'job2',
        jobTitle: 'Full Stack Developer',
        company: 'Digital Innovations',
        location: 'New York, NY',
        department: 'Engineering',
        type: 'remote',
        salary: {
          currency: 'USD',
          min: 100000,
          max: 150000,
        },
        status: 'screening',
        appliedAt: '2024-01-12T09:15:00Z',
        lastUpdated: '2024-01-18T11:30:00Z',
        resumeUrl: '/resumes/john_doe_resume.pdf',
        coverLetter: 'Interested in this full stack opportunity...',
        matchScore: 78,
        skillsMatch: ['React', 'Python', 'PostgreSQL'],
      },
      {
        id: '3',
        jobId: 'job3',
        jobTitle: 'React Developer',
        company: 'StartupXYZ',
        location: 'Austin, TX',
        department: 'Engineering',
        type: 'contract',
        salary: {
          currency: 'USD',
          min: 80,
          max: 120,
        },
        status: 'rejected',
        appliedAt: '2024-01-08T16:45:00Z',
        lastUpdated: '2024-01-10T10:20:00Z',
        feedback: [
          {
            date: '2024-01-10T10:20:00Z',
            message: 'Thank you for your interest, but we have decided to move forward with other candidates',
            type: 'recruiter',
          },
        ],
        matchScore: 65,
        skillsMatch: ['React', 'JavaScript'],
      },
      {
        id: '4',
        jobId: 'job4',
        jobTitle: 'Frontend Engineer',
        company: 'Enterprise Systems',
        location: 'Boston, MA',
        department: 'Engineering',
        type: 'hybrid',
        salary: {
          currency: 'USD',
          min: 110000,
          max: 160000,
        },
        status: 'shortlisted',
        appliedAt: '2024-01-05T11:20:00Z',
        lastUpdated: '2024-01-22T09:45:00Z',
        interviewDates: [
          {
            type: 'Phone Screen',
            date: '2024-01-10',
            time: '15:00',
            status: 'completed',
          },
          {
            type: 'Technical Interview',
            date: '2024-01-18',
            time: '13:00',
            status: 'completed',
          },
        ],
        feedback: [
          {
            date: '2024-01-22T09:45:00Z',
            message: 'Congratulations! You have been shortlisted for the final round',
            type: 'recruiter',
          },
        ],
        matchScore: 92,
        skillsMatch: ['React', 'TypeScript', 'CSS', 'Testing'],
      },
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setFilteredApplications(mockApplications);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Sort applications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchTerm, filterStatus, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
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
      case 'withdrawn': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDetails(true);
  };

  const handleWithdrawApplication = (applicationId: string) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      setApplications(prev => prev.map(app =>
        app.id === applicationId
          ? { ...app, status: 'withdrawn', lastUpdated: new Date().toISOString() }
          : app
      ));
    }
  };

  const formatSalary = (salary: Application['salary']) => {
    if (salary.min >= 1000) {
      return `${salary.currency} ${(salary.min / 1000).toFixed(0)}k-${(salary.max / 1000).toFixed(0)}k`;
    }
    return `${salary.currency} ${salary.min}-${salary.max}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysAgo = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

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
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600">Track and manage your job applications</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => ['applied', 'screening', 'interview', 'shortlisted'].includes(app.status)).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Interviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'interview').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Match Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.length > 0 
                  ? Math.round(applications.reduce((sum, app) => sum + (app.matchScore || 0), 0) / applications.length)
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by job title, company, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
              <option value="company">Sort by Company</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredApplications.length} of {applications.length} applications
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match
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
                        {application.jobTitle}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{application.location}</span>
                        <span>•</span>
                        <span className="capitalize">{application.type}</span>
                      </div>
                      {application.salary && (
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="w-3 h-3" />
                          <span>{formatSalary(application.salary)}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.company}</div>
                    <div className="text-sm text-gray-500">{application.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(application.appliedAt)}</div>
                    <div className="text-xs text-gray-500">{getDaysAgo(application.appliedAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.matchScore && (
                      <div className="flex items-center">
                        <div className="flex-1 mr-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                application.matchScore >= 80 ? 'bg-green-500' :
                                application.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${application.matchScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${getMatchScoreColor(application.matchScore)}`}>
                          {application.matchScore}%
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {application.status !== 'rejected' && application.status !== 'withdrawn' && (
                        <button
                          onClick={() => handleWithdrawApplication(application.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Withdraw Application"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Start applying for jobs to see them here'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/candidate/jobs')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
              </button>
            )}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Job Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Job Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-medium text-gray-900">{selectedApplication.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">{selectedApplication.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{selectedApplication.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{selectedApplication.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedApplication.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Salary</p>
                    <p className="font-medium text-gray-900">
                      {selectedApplication.salary ? formatSalary(selectedApplication.salary) : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Status</h3>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusIcon(selectedApplication.status)}
                    <span className="ml-1 capitalize">{selectedApplication.status}</span>
                  </span>
                  {selectedApplication.matchScore && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Match Score:</span>
                      <span className={`font-medium ${getMatchScoreColor(selectedApplication.matchScore)}`}>
                        {selectedApplication.matchScore}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Applied on {formatDate(selectedApplication.appliedAt)}</p>
                  <p className="text-sm text-gray-600">Last updated {formatDate(selectedApplication.lastUpdated)}</p>
                </div>
              </div>

              {/* Interview Schedule */}
              {selectedApplication.interviewDates && selectedApplication.interviewDates.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Schedule</h3>
                  <div className="space-y-3">
                    {selectedApplication.interviewDates.map((interview, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{interview.type}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(interview.date)} at {interview.time}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                            interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {interview.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Match */}
              {selectedApplication.skillsMatch && selectedApplication.skillsMatch.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Match</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skillsMatch.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {selectedApplication.feedback && selectedApplication.feedback.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback</h3>
                  <div className="space-y-3">
                    {selectedApplication.feedback.map((feedback, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${
                            feedback.type === 'recruiter' ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {feedback.type === 'recruiter' ? 'Recruiter' : 'System'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(feedback.date)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{feedback.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedApplication.status !== 'rejected' && selectedApplication.status !== 'withdrawn' && (
                  <button
                    onClick={() => {
                      handleWithdrawApplication(selectedApplication.id);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Withdraw Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
