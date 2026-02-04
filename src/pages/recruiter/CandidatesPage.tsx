import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Users, Briefcase, MapPin, Calendar, Clock, Eye, Edit, Trash2, Star, Mail, Phone, ChevronDown, ChevronUp, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { selectUser } from '../../store/slices/authSlice';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  experience: string;
  skills: string[];
  avatar?: string;
  resumeUrl?: string;
  applicationDate: string;
  status: 'new' | 'screening' | 'interview' | 'shortlisted' | 'rejected' | 'hired';
  matchScore?: number;
  appliedJobs: string[];
  lastActivity: string;
  notes?: string;
  source: string;
  recruiter: string;
}

const CandidatesPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedCandidates, setExpandedCandidates] = useState<string[]>([]);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        position: 'Senior Frontend Developer',
        experience: '5 years',
        skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'JavaScript'],
        avatar: '/avatars/john_doe.jpg',
        resumeUrl: '/resumes/john_doe.pdf',
        applicationDate: '2024-01-15T10:30:00Z',
        status: 'interview',
        matchScore: 92,
        appliedJobs: ['Senior Frontend Developer', 'Full Stack Developer'],
        lastActivity: '2024-01-20T14:15:00Z',
        notes: 'Strong technical skills, good cultural fit',
        source: 'LinkedIn',
        recruiter: 'Sarah Johnson',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1 (555) 987-6543',
        location: 'New York, NY',
        position: 'Full Stack Developer',
        experience: '3 years',
        skills: ['React', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
        avatar: '/avatars/jane_smith.jpg',
        resumeUrl: '/resumes/jane_smith.pdf',
        applicationDate: '2024-01-12T09:15:00Z',
        status: 'screening',
        matchScore: 88,
        appliedJobs: ['Full Stack Developer', 'Backend Developer'],
        lastActivity: '2024-01-18T11:30:00Z',
        source: 'Company Website',
        recruiter: 'Michael Chen',
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        phone: '+1 (555) 456-7890',
        location: 'Austin, TX',
        position: 'React Developer',
        experience: '2 years',
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
        avatar: '/avatars/mike_johnson.jpg',
        resumeUrl: '/resumes/mike_johnson.pdf',
        applicationDate: '2024-01-10T16:45:00Z',
        status: 'shortlisted',
        matchScore: 75,
        appliedJobs: ['React Developer', 'Frontend Developer'],
        lastActivity: '2024-01-22T09:45:00Z',
        source: 'Indeed',
        recruiter: 'Emily Rodriguez',
      },
      {
        id: '4',
        name: 'Sarah Williams',
        email: 'sarah.williams@email.com',
        phone: '+1 (555) 234-5678',
        location: 'Boston, MA',
        position: 'UX Designer',
        experience: '4 years',
        skills: ['Figma', 'Sketch', 'Adobe XD', 'CSS', 'Prototyping'],
        avatar: '/avatars/sarah_williams.jpg',
        resumeUrl: '/resumes/sarah_williams.pdf',
        applicationDate: '2024-01-08T14:20:00Z',
        status: 'new',
        matchScore: 85,
        appliedJobs: ['UX Designer', 'Product Designer'],
        lastActivity: '2024-01-08T14:20:00Z',
        source: 'Referral',
        recruiter: 'David Kim',
      },
      {
        id: '5',
        name: 'Tom Brown',
        email: 'tom.brown@email.com',
        phone: '+1 (555) 345-6789',
        location: 'Seattle, WA',
        position: 'DevOps Engineer',
        experience: '6 years',
        skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
        avatar: '/avatars/tom_brown.jpg',
        resumeUrl: '/resumes/tom_brown.pdf',
        applicationDate: '2024-01-05T11:10:00Z',
        status: 'rejected',
        matchScore: 70,
        appliedJobs: ['DevOps Engineer', 'Site Reliability Engineer'],
        lastActivity: '2024-01-10T10:20:00Z',
        source: 'Glassdoor',
        recruiter: 'Lisa Thompson',
      },
    ];

    setTimeout(() => {
      setCandidates(mockCandidates);
      setFilteredCandidates(mockCandidates);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = candidates;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(candidate => candidate.status === filterStatus);
    }

    // Apply experience filter
    if (filterExperience) {
      filtered = filtered.filter(candidate => candidate.experience === filterExperience);
    }

    // Sort by last activity (most recent first)
    filtered.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, filterStatus, filterExperience]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Users className="w-4 h-4" />;
      case 'screening': return <Clock className="w-4 h-4" />;
      case 'interview': return <Calendar className="w-4 h-4" />;
      case 'shortlisted': return <Star className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'hired': return <CheckCircle className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowDetails(true);
  };

  const handleScheduleInterview = (candidateId: string) => {
    navigate(`/recruiter/schedule-interview?candidateId=${candidateId}`);
  };

  const handleViewResume = (resumeUrl: string) => {
    // In real app, this would open the resume
    console.log('Viewing resume:', resumeUrl);
  };

  const toggleCandidateExpansion = (candidateId: string) => {
    setExpandedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
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
        <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        <p className="text-gray-600">Manage and track candidate applications</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {candidates.filter(c => c.status === 'new').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Interview</p>
              <p className="text-2xl font-bold text-gray-900">
                {candidates.filter(c => c.status === 'interview').length}
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
              <p className="text-sm font-medium text-gray-600">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">
                {candidates.filter(c => c.status === 'shortlisted').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, position, location, or skills..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>

          <select
            value={filterExperience}
            onChange={(e) => setFilterExperience(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Experience</option>
            <option value="0-1 years">0-1 years</option>
            <option value="2-3 years">2-3 years</option>
            <option value="4-5 years">4-5 years</option>
            <option value="6+ years">6+ years</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{candidate.position}</div>
                    <div className="text-sm text-gray-500">{candidate.experience}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {candidate.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                      {getStatusIcon(candidate.status)}
                      <span className="ml-1 capitalize">{candidate.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {candidate.matchScore && (
                      <div className="flex items-center">
                        <div className="flex-1 mr-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                candidate.matchScore >= 80 ? 'bg-green-500' :
                                candidate.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${candidate.matchScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${getMatchScoreColor(candidate.matchScore)}`}>
                          {candidate.matchScore}%
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(candidate.applicationDate)}</div>
                    <div className="text-xs text-gray-500">{getDaysAgo(candidate.applicationDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(candidate)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewResume(candidate.resumeUrl!)}
                        className="text-green-600 hover:text-green-900"
                        title="View Resume"
                      >
                        <Briefcase className="w-4 h-4" />
                      </button>
                      {candidate.status !== 'rejected' && candidate.status !== 'hired' && (
                        <button
                          onClick={() => handleScheduleInterview(candidate.id)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Schedule Interview"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus || filterExperience
                ? 'Try adjusting your filters or search terms'
                : 'No candidates have applied yet'
              }
            </p>
            {(searchTerm || filterStatus || filterExperience) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('');
                  setFilterExperience('');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      {showDetails && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Candidate Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Candidate Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedCandidate.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedCandidate.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{selectedCandidate.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{selectedCandidate.location}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-medium text-gray-900">{selectedCandidate.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium text-gray-900">{selectedCandidate.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Match Score</p>
                    <p className={`font-medium ${getMatchScoreColor(selectedCandidate.matchScore || 0)}`}>
                      {selectedCandidate.matchScore}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applied Jobs</p>
                    <div className="space-y-1">
                      {selectedCandidate.appliedJobs.map((job, index) => (
                        <span key={index} className="text-sm text-gray-700">• {job}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleViewResume(selectedCandidate.resumeUrl!)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Resume
                </button>
                {selectedCandidate.status !== 'rejected' && selectedCandidate.status !== 'hired' && (
                  <button
                    onClick={() => {
                      handleScheduleInterview(selectedCandidate.id);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Schedule Interview
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

export default CandidatesPage;
