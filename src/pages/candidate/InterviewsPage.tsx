import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin, User, CheckCircle, XCircle, AlertCircle, Filter, Search, Eye, Download, FileText, Star, MessageSquare, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { selectUser } from '../../store/slices/authSlice';

interface Interview {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  type: 'phone-screen' | 'technical' | 'behavioral' | 'final' | 'panel' | 'on-site';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
  date: string;
  time: string;
  duration: number; // in minutes
  interviewer: {
    name: string;
    role: string;
    email: string;
    avatar?: string;
  };
  meetingLink?: string;
  meetingType: 'video' | 'phone' | 'in-person';
  notes?: string;
  preparation?: string[];
  feedback?: {
    overall: number; // 1-5
    technical: number; // 1-5
    communication: number; // 1-5
    cultural: number; // 1-5
    comments: string;
    interviewer: string;
    date: string;
    nextSteps?: string;
  };
  recording?: string;
  transcript?: string;
  score?: number;
  nextSteps?: string;
  reminderSent: boolean;
  calendarInviteSent: boolean;
}

const InterviewsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedInterviews, setExpandedInterviews] = useState<string[]>([]);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockInterviews: Interview[] = [
      {
        id: '1',
        jobId: 'job1',
        jobTitle: 'Senior Frontend Developer',
        company: 'TechCorp Solutions',
        location: 'San Francisco, CA',
        type: 'technical',
        status: 'scheduled',
        date: '2024-02-05',
        time: '14:00',
        duration: 60,
        interviewer: {
          name: 'Sarah Johnson',
          role: 'Senior Engineering Manager',
          email: 'sarah.johnson@techcorp.com',
          avatar: '/avatars/sarah.jpg',
        },
        meetingLink: 'https://zoom.us/j/123456789',
        meetingType: 'video',
        notes: 'Focus on React and TypeScript skills. Bring portfolio examples.',
        preparation: [
          'Review React hooks and state management',
          'Prepare examples of previous projects',
          'Practice common frontend coding challenges',
          'Research company culture and values',
        ],
        reminderSent: true,
        calendarInviteSent: true,
      },
      {
        id: '2',
        jobId: 'job2',
        jobTitle: 'Full Stack Developer',
        company: 'Digital Innovations',
        location: 'New York, NY',
        type: 'behavioral',
        status: 'scheduled',
        date: '2024-02-07',
        time: '10:00',
        duration: 45,
        interviewer: {
          name: 'Michael Chen',
          role: 'HR Manager',
          email: 'michael.chen@digitalinnovations.com',
          avatar: '/avatars/michael.jpg',
        },
        meetingLink: 'https://meet.google.com/abc-123-def',
        meetingType: 'video',
        notes: 'Behavioral interview focusing on team collaboration and problem-solving.',
        preparation: [
          'Prepare STAR method examples',
          'Review your past project experiences',
          'Research company values and mission',
          'Prepare questions for the interviewer',
        ],
        reminderSent: true,
        calendarInviteSent: true,
      },
      {
        id: '3',
        jobId: 'job3',
        jobTitle: 'React Developer',
        company: 'StartupXYZ',
        location: 'Austin, TX',
        type: 'phone-screen',
        status: 'completed',
        date: '2024-01-28',
        time: '15:30',
        duration: 30,
        interviewer: {
          name: 'Emily Rodriguez',
          role: 'Technical Recruiter',
          email: 'emily.rodriguez@startupxyz.com',
        },
        meetingType: 'phone',
        feedback: {
          overall: 4,
          technical: 4,
          communication: 5,
          cultural: 4,
          comments: 'Strong technical skills and excellent communication. Good cultural fit for the team. Recommended for next round.',
          interviewer: 'Emily Rodriguez',
          date: '2024-01-28',
          nextSteps: 'Technical interview scheduled for next week',
        },
        score: 85,
        nextSteps: 'Technical interview scheduled for next week',
        recording: '/recordings/interview_3.mp4',
        transcript: '/transcripts/interview_3.txt',
        reminderSent: true,
        calendarInviteSent: true,
      },
      {
        id: '4',
        jobId: 'job4',
        jobTitle: 'Frontend Engineer',
        company: 'Enterprise Systems',
        location: 'Boston, MA',
        type: 'final',
        status: 'completed',
        date: '2024-01-22',
        time: '13:00',
        duration: 90,
        interviewer: {
          name: 'David Kim',
          role: 'VP of Engineering',
          email: 'david.kim@enterprisesystems.com',
          avatar: '/avatars/david.jpg',
        },
        meetingType: 'in-person',
        feedback: {
          overall: 5,
          technical: 5,
          communication: 4,
          cultural: 5,
          comments: 'Outstanding technical abilities and great problem-solving skills. Excellent cultural fit. Extending offer.',
          interviewer: 'David Kim',
          date: '2024-01-22',
          nextSteps: 'Offer extended - awaiting response',
        },
        score: 95,
        nextSteps: 'Offer extended - awaiting response',
        recording: '/recordings/interview_4.mp4',
        transcript: '/transcripts/interview_4.txt',
        reminderSent: true,
        calendarInviteSent: true,
      },
      {
        id: '5',
        jobId: 'job5',
        jobTitle: 'JavaScript Developer',
        company: 'WebCraft Agency',
        location: 'Los Angeles, CA',
        type: 'panel',
        status: 'cancelled',
        date: '2024-01-15',
        time: '11:00',
        duration: 60,
        interviewer: {
          name: 'Lisa Thompson',
          role: 'Creative Director',
          email: 'lisa.thompson@webcraft.com',
        },
        meetingType: 'video',
        notes: 'Interview cancelled by company due to scheduling conflict. Rescheduled for next week.',
        reminderSent: false,
        calendarInviteSent: false,
      },
    ];

    setTimeout(() => {
      setInterviews(mockInterviews);
      setFilteredInterviews(mockInterviews);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = interviews;

    // Filter by tab
    const now = new Date();
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(interview => 
        new Date(interview.date) >= now && interview.status === 'scheduled'
      );
    } else if (activeTab === 'past') {
      filtered = filtered.filter(interview => 
        new Date(interview.date) < now || interview.status === 'completed'
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(interview =>
        interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.interviewer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter(interview => interview.type === filterType);
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(interview => interview.status === filterStatus);
    }

    // Sort by date (upcoming first, then past)
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    setFilteredInterviews(filtered);
  }, [interviews, activeTab, searchTerm, filterType, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'phone-screen': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'behavioral': return 'bg-green-100 text-green-800';
      case 'final': return 'bg-orange-100 text-orange-800';
      case 'panel': return 'bg-red-100 text-red-800';
      case 'on-site': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleViewDetails = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowDetails(true);
  };

  const handleJoinInterview = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const handleDownloadRecording = (recording: string) => {
    // In real app, this would download the recording
    console.log('Downloading recording:', recording);
  };

  const handleViewTranscript = (transcript: string) => {
    // In real app, this would open the transcript
    console.log('Viewing transcript:', transcript);
  };

  const toggleInterviewExpansion = (interviewId: string) => {
    setExpandedInterviews(prev => 
      prev.includes(interviewId) 
        ? prev.filter(id => id !== interviewId)
        : [...prev, interviewId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isUpcoming = (interview: Interview) => {
    return new Date(interview.date) >= new Date() && interview.status === 'scheduled';
  };

  const getInterviewStats = () => {
    const now = new Date();
    const upcoming = interviews.filter(i => 
      new Date(i.date) >= now && i.status === 'scheduled'
    ).length;
    const completed = interviews.filter(i => i.status === 'completed').length;
    const cancelled = interviews.filter(i => i.status === 'cancelled').length;
    const total = interviews.length;

    return { upcoming, completed, cancelled, total };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getInterviewStats();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>
        <p className="text-gray-600">View upcoming and past interviews, manage your schedule</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="flex space-x-1 mb-4 md:mb-0">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming ({stats.upcoming})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Past ({stats.completed + stats.cancelled})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search interviews..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="phone-screen">Phone Screen</option>
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="final">Final</option>
              <option value="panel">Panel</option>
              <option value="on-site">On-site</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredInterviews.length} of {interviews.length} interviews
        </div>
      </div>

      {/* Interview List */}
      <div className="space-y-4">
        {filteredInterviews.map((interview) => (
          <div key={interview.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {interview.jobTitle}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span className="font-medium">{interview.company}</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {interview.location}
                            </div>
                            <span>•</span>
                            <span className={getTypeColor(interview.type)}>
                              {interview.type.replace('-', ' ')}
                            </span>
                            <span>•</span>
                            <span className={getStatusColor(interview.status)}>
                              {interview.status}
                            </span>
                          </div>
                        </div>
                        
                        {isUpcoming(interview) && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {formatDate(interview.date)} at {formatTime(interview.time)}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({interview.duration} min)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span>Interviewer: {interview.interviewer.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500">({interview.interviewer.role})</span>
                        </div>
                        <div className="flex items-center">
                          {interview.meetingType === 'video' && <Video className="w-3 h-3 mr-1" />}
                          {interview.meetingType === 'phone' && <Phone className="w-3 h-3 mr-1" />}
                          {interview.meetingType === 'in-person' && <MapPin className="w-3 h-3 mr-1" />}
                          <span className="capitalize">{interview.meetingType.replace('-', ' ')}</span>
                        </div>
                      </div>

                      {interview.feedback && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">Interview Feedback</span>
                            <span className={`text-sm font-medium ${getScoreColor(interview.feedback.overall * 20)}`}>
                              {interview.feedback.overall * 20}/100
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
                            <div className="flex items-center">
                              <span>Technical:</span>
                              <div className="flex ml-1">{getRatingStars(interview.feedback.technical)}</div>
                            </div>
                            <div className="flex items-center">
                              <span>Communication:</span>
                              <div className="flex ml-1">{getRatingStars(interview.feedback.communication)}</div>
                            </div>
                            <div className="flex items-center">
                              <span>Cultural:</span>
                              <div className="flex ml-1">{getRatingStars(interview.feedback.cultural)}</div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 italic">"{interview.feedback.comments}"</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {interview.reminderSent && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              <span>Reminder sent</span>
                            </div>
                          )}
                          {interview.calendarInviteSent && (
                            <div className="flex items-center text-green-600">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>Calendar invite sent</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleInterviewExpansion(interview.id)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm"
                          >
                            {expandedInterviews.includes(interview.id) ? 'Less' : 'More'}
                          </button>
                          <button
                            onClick={() => handleViewDetails(interview)}
                            className="px-3 py-1 text-blue-600 hover:text-blue-900 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isUpcoming(interview) && interview.meetingLink && (
                            <button
                              onClick={() => handleJoinInterview(interview.meetingLink)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Join Interview
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedInterviews.includes(interview.id) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {interview.notes && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Interview Notes</h4>
                      <p className="text-sm text-gray-700">{interview.notes}</p>
                    </div>
                  )}

                  {interview.preparation && interview.preparation.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Preparation Tips</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {interview.preparation.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {interview.feedback && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
                      <p className="text-sm text-gray-700">{interview.feedback.nextSteps}</p>
                    </div>
                  )}

                  {interview.recording && (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleDownloadRecording(interview.recording)}
                        className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:text-blue-900 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Recording</span>
                      </button>
                      {interview.transcript && (
                        <button
                          onClick={() => handleViewTranscript(interview.transcript)}
                          className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:text-blue-900 text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Transcript</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredInterviews.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
          <p className="text-gray-600 mb-4">
            {activeTab === 'upcoming' 
              ? 'You have no upcoming interviews scheduled'
              : activeTab === 'past'
              ? 'You have no past interviews'
              : 'No interviews match your current filters'
            }
          </p>
          {(searchTerm || filterType || filterStatus) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('');
                setFilterStatus('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Interview Details Modal */}
      {showDetails && selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Interview Details</h2>
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
                    <p className="font-medium text-gray-900">{selectedInterview.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">{selectedInterview.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{selectedInterview.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interview Type</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedInterview.type.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>

              {/* Interview Schedule */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedInterview.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">{formatTime(selectedInterview.time)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{selectedInterview.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Meeting Type</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedInterview.meetingType.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>

              {/* Interviewer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Interviewer</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedInterview.interviewer.name}</p>
                    <p className="text-sm text-gray-600">{selectedInterview.interviewer.role}</p>
                    <p className="text-sm text-gray-600">{selectedInterview.interviewer.email}</p>
                  </div>
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
                {isUpcoming(selectedInterview) && selectedInterview.meetingLink && (
                  <button
                    onClick={() => {
                      handleJoinInterview(selectedInterview.meetingLink);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Join Interview
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

export default InterviewsPage;
