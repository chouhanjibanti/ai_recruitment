import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin, User, Mail, Phone, CheckCircle, XCircle, AlertCircle, Save, Plus, Trash2, Search, Filter, Eye, Edit } from 'lucide-react';
import { selectUser } from '../../store/slices/authSlice';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills: string[];
  location: string;
  avatar?: string;
  resumeUrl?: string;
  applicationDate: string;
  status: 'screening' | 'interview' | 'shortlisted' | 'rejected' | 'hired';
  matchScore?: number;
}

interface InterviewSchedule {
  candidateId: string;
  jobId: string;
  jobTitle: string;
  type: 'phone-screen' | 'technical' | 'behavioral' | 'final' | 'panel' | 'on-site';
  date: string;
  time: string;
  duration: number;
  meetingType: 'video' | 'phone' | 'in-person';
  location?: string;
  meetingLink?: string;
  interviewerIds: string[];
  notes?: string;
  preparation?: string[];
  reminderSettings: {
    email: boolean;
    sms: boolean;
    calendar: boolean;
  };
}

const ScheduleInterviewPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useSelector(selectUser);
  
  const candidateId = searchParams.get('candidateId');
  const jobId = searchParams.get('jobId');
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const [interviewSchedule, setInterviewSchedule] = useState<InterviewSchedule>({
    candidateId: candidateId || '',
    jobId: jobId || '',
    jobTitle: '',
    type: 'phone-screen',
    date: '',
    time: '',
    duration: 60,
    meetingType: 'video',
    location: '',
    meetingLink: '',
    interviewerIds: [],
    notes: '',
    preparation: [''],
    reminderSettings: {
      email: true,
      sms: false,
      calendar: true,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        position: 'Senior Frontend Developer',
        experience: '5 years',
        skills: ['React', 'TypeScript', 'Node.js', 'CSS'],
        location: 'San Francisco, CA',
        resumeUrl: '/resumes/john_doe.pdf',
        applicationDate: '2024-01-15',
        status: 'screening',
        matchScore: 92,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1 (555) 987-6543',
        position: 'Full Stack Developer',
        experience: '3 years',
        skills: ['React', 'Python', 'PostgreSQL', 'Docker'],
        location: 'New York, NY',
        resumeUrl: '/resumes/jane_smith.pdf',
        applicationDate: '2024-01-12',
        status: 'interview',
        matchScore: 88,
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        phone: '+1 (555) 456-7890',
        position: 'React Developer',
        experience: '2 years',
        skills: ['React', 'JavaScript', 'HTML', 'CSS'],
        location: 'Austin, TX',
        resumeUrl: '/resumes/mike_johnson.pdf',
        applicationDate: '2024-01-10',
        status: 'shortlisted',
        matchScore: 75,
      },
    ];

    setTimeout(() => {
      setCandidates(mockCandidates);
      
      // Auto-select candidate if candidateId is provided
      if (candidateId) {
        const candidate = mockCandidates.find(c => c.id === candidateId);
        if (candidate) {
          setSelectedCandidate(candidate);
          setInterviewSchedule(prev => ({
            ...prev,
            candidateId: candidate.id,
            jobTitle: candidate.position,
          }));
        }
      }
      
      setIsLoading(false);
    }, 1000);
  }, [candidateId]);

  useEffect(() => {
    if (selectedCandidate) {
      setInterviewSchedule(prev => ({
        ...prev,
        candidateId: selectedCandidate.id,
        jobTitle: selectedCandidate.position,
      }));
    }
  }, [selectedCandidate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!interviewSchedule.candidateId) {
      newErrors.candidate = 'Please select a candidate';
    }
    if (!interviewSchedule.type) {
      newErrors.type = 'Interview type is required';
    }
    if (!interviewSchedule.date) {
      newErrors.date = 'Interview date is required';
    }
    if (!interviewSchedule.time) {
      newErrors.time = 'Interview time is required';
    }
    if (interviewSchedule.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    if (interviewSchedule.meetingType === 'in-person' && !interviewSchedule.location) {
      newErrors.location = 'Location is required for in-person interviews';
    }
    if ((interviewSchedule.meetingType === 'video' || interviewSchedule.meetingType === 'phone') && !interviewSchedule.meetingLink) {
      newErrors.meetingLink = 'Meeting link is required for video/phone interviews';
    }
    if (interviewSchedule.interviewerIds.length === 0) {
      newErrors.interviewers = 'At least one interviewer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const interviewData = {
        ...interviewSchedule,
        scheduledBy: user?.name,
        scheduledAt: new Date().toISOString(),
        status: 'scheduled',
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Interview scheduled:', interviewData);
      setSubmitStatus('success');
      
      // Navigate to interviews list after successful scheduling
      setTimeout(() => {
        navigate('/recruiter/interviews');
      }, 2000);
    } catch (error) {
      console.error('Error scheduling interview:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setInterviewSchedule(prev => ({
      ...prev,
      candidateId: candidate.id,
      jobTitle: candidate.position,
    }));
  };

  const addPreparationItem = () => {
    setInterviewSchedule(prev => ({
      ...prev,
      preparation: [...prev.preparation, ''],
    }));
  };

  const removePreparationItem = (index: number) => {
    setInterviewSchedule(prev => ({
      ...prev,
      preparation: prev.preparation.filter((_, i) => i !== index),
    }));
  };

  const updatePreparationItem = (index: number, value: string) => {
    setInterviewSchedule(prev => ({
      ...prev,
      preparation: prev.preparation.map((item, i) => i === index ? value : item),
    }));
  };

  const generateMeetingLink = () => {
    // In real app, this would integrate with Zoom, Google Meet, etc.
    const mockLink = `https://zoom.us/j/${Math.random().toString(36).substr(2, 9)}`;
    setInterviewSchedule(prev => ({
      ...prev,
      meetingLink: mockLink,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'screening': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !filterStatus || candidate.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Schedule Interview</h1>
        <p className="text-gray-600">Schedule interviews with qualified candidates</p>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>Interview scheduled successfully!</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>Error scheduling interview. Please try again.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Candidate</h2>
            
            {/* Search and Filter */}
            <div className="mb-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search candidates..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>

            {/* Candidate List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => handleCandidateSelect(candidate)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCandidate?.id === candidate.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">{candidate.position}</p>
                      <p className="text-xs text-gray-500">{candidate.location}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                        {candidate.matchScore && (
                          <span className={`text-xs font-medium ${getMatchScoreColor(candidate.matchScore)}`}>
                            {candidate.matchScore}% match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interview Schedule Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Interview Details</h2>
            
            {selectedCandidate ? (
              <div className="space-y-6">
                {/* Selected Candidate Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedCandidate.name}</h3>
                      <p className="text-sm text-gray-600">{selectedCandidate.position}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>{selectedCandidate.email}</span>
                        <span>•</span>
                        <span>{selectedCandidate.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interview Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type *</label>
                  <select
                    value={interviewSchedule.type}
                    onChange={(e) => setInterviewSchedule(prev => ({ ...prev, type: e.target.value as any }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="phone-screen">Phone Screen</option>
                    <option value="technical">Technical Interview</option>
                    <option value="behavioral">Behavioral Interview</option>
                    <option value="final">Final Interview</option>
                    <option value="panel">Panel Interview</option>
                    <option value="on-site">On-site Interview</option>
                  </select>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      value={interviewSchedule.date}
                      onChange={(e) => setInterviewSchedule(prev => ({ ...prev, date: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                    <input
                      type="time"
                      value={interviewSchedule.time}
                      onChange={(e) => setInterviewSchedule(prev => ({ ...prev, time: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.time ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                    <input
                      type="number"
                      value={interviewSchedule.duration}
                      onChange={(e) => setInterviewSchedule(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.duration ? 'border-red-500' : 'border-gray-300'
                      }`}
                      min="15"
                      max="240"
                    />
                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                  </div>
                </div>

                {/* Meeting Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
                  <div className="flex space-x-4">
                    {['video', 'phone', 'in-person'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          value={type}
                          checked={interviewSchedule.meetingType === type}
                          onChange={(e) => setInterviewSchedule(prev => ({ ...prev, meetingType: e.target.value as any }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 capitalize">{type.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location or Meeting Link */}
                {interviewSchedule.meetingType === 'in-person' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      value={interviewSchedule.location}
                      onChange={(e) => setInterviewSchedule(prev => ({ ...prev, location: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g. Office Address, Meeting Room"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link *</label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={interviewSchedule.meetingLink}
                        onChange={(e) => setInterviewSchedule(prev => ({ ...prev, meetingLink: e.target.value }))}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.meetingLink ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://zoom.us/j/123456789"
                      />
                      <button
                        onClick={generateMeetingLink}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                    {errors.meetingLink && <p className="text-red-500 text-sm mt-1">{errors.meetingLink}</p>}
                  </div>
                )}

                {/* Interviewers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interviewers *</label>
                  <div className="space-y-2">
                    {['You (Recruiter)', 'Hiring Manager', 'Technical Lead'].map((interviewer, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={interviewSchedule.interviewerIds.includes(interviewer)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setInterviewSchedule(prev => ({
                                ...prev,
                                interviewerIds: [...prev.interviewerIds, interviewer],
                              }));
                            } else {
                              setInterviewSchedule(prev => ({
                                ...prev,
                                interviewerIds: prev.interviewerIds.filter(id => id !== interviewer),
                              }));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">{interviewer}</span>
                      </label>
                    ))}
                  </div>
                  {errors.interviewers && <p className="text-red-500 text-sm mt-1">{errors.interviewers}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interview Notes</label>
                  <textarea
                    value={interviewSchedule.notes}
                    onChange={(e) => setInterviewSchedule(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any notes for the interview..."
                  />
                </div>

                {/* Preparation Items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Preparation Items</label>
                    <button
                      onClick={addPreparationItem}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {interviewSchedule.preparation.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updatePreparationItem(index, e.target.value)}
                          placeholder="Enter preparation item..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {interviewSchedule.preparation.length > 1 && (
                          <button
                            onClick={() => removePreparationItem(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reminder Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Settings</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={interviewSchedule.reminderSettings.email}
                        onChange={(e) => setInterviewSchedule(prev => ({
                          ...prev,
                          reminderSettings: { ...prev.reminderSettings, email: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Send email reminder</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={interviewSchedule.reminderSettings.sms}
                        onChange={(e) => setInterviewSchedule(prev => ({
                          ...prev,
                          reminderSettings: { ...prev.reminderSettings, sms: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Send SMS reminder</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={interviewSchedule.reminderSettings.calendar}
                        onChange={(e) => setInterviewSchedule(prev => ({
                          ...prev,
                          reminderSettings: { ...prev.reminderSettings, calendar: e.target.checked }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Send calendar invite</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/recruiter/candidates')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Candidate</h3>
                <p className="text-gray-600">Choose a candidate from the list to schedule an interview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewPage;
