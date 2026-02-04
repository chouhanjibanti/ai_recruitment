import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidatesAsync, updateCandidateStatus } from '../../store/slices/candidatesSlice';
import { fetchJobsAsync } from '../../store/slices/jobsSlice';
import { selectCandidatesList, selectCandidatesLoading } from '../../store/slices/candidatesSlice';
import { selectJobsList } from '../../store/slices/jobsSlice';
import { type Candidate, type Job } from '../../types';
import { User, FileText, Star, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Download, Calendar, MapPin, DollarSign, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CandidateReviewProps {
  candidateId?: string;
}

const CandidateReview: React.FC<CandidateReviewProps> = ({ candidateId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const candidates = useSelector(selectCandidatesList);
  const jobs = useSelector(selectJobsList);
  const isLoading = useSelector(selectCandidatesLoading);
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'resume' | 'interview' | 'notes'>('profile');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [decision, setDecision] = useState<'pending' | 'shortlist' | 'hold' | 'reject'>('pending');

  useEffect(() => {
    dispatch(fetchCandidatesAsync());
    dispatch(fetchJobsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (candidateId && candidates.length > 0) {
      const foundCandidate = candidates.find(c => c.id === candidateId);
      setCandidate(foundCandidate || null);
    }
  }, [candidateId, candidates]);

  const handleStatusUpdate = (newStatus: string) => {
    if (!candidate) return;
    
    dispatch(updateCandidateStatus({
      candidateId: candidate.id,
      status: newStatus as Candidate['currentStatus']
    }));
    
    setDecision(newStatus as any);
  };

  const handleSaveNotes = () => {
    // Save notes logic here
    console.log('Saving notes:', notes);
  };

  const handleDownloadResume = () => {
    if (candidate?.resume) {
      window.open(candidate.resume, '_blank');
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'beginner': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'shortlist': return 'bg-green-100 text-green-800';
      case 'hold': return 'bg-yellow-100 text-yellow-800';
      case 'reject': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Candidate not found</h3>
        <p className="text-gray-600">The candidate you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-600">{candidate.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">
                  {candidate.experience} years experience
                </span>
                <span className="text-sm text-gray-500">
                  {candidate.location?.join(', ')}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  candidate.currentStatus === 'available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {candidate.currentStatus}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadResume}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Resume
            </button>
            <button
              onClick={() => navigate(`/recruiter/interviews/schedule/${candidate.id}`)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Schedule Interview
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['profile', 'resume', 'interview', 'notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{candidate.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{candidate.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900">{candidate.location?.join(', ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <p className="text-gray-900">{candidate.experience} years</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                <div className="space-y-3">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium text-gray-900">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Expectation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Expectation</h3>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">
                    {candidate.expectedSalary.currency} {candidate.expectedSalary.min.toLocaleString()} - {candidate.expectedSalary.max.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Resume Tab */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Resume Analysis</h3>
                <p className="text-gray-600 mb-4">Resume parsing and analysis features coming soon.</p>
                <button
                  onClick={handleDownloadResume}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download Resume
                </button>
              </div>
            </div>
          )}

          {/* Interview Tab */}
          {activeTab === 'interview' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Interview History</h3>
                <p className="text-gray-600 mb-4">No interview history available yet.</p>
                <button
                  onClick={() => navigate(`/recruiter/interviews/schedule/${candidate.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Rating */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Rating</h3>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add your notes about this candidate..."
                />
                <button
                  onClick={handleSaveNotes}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Notes
                </button>
              </div>

              {/* Decision */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Decision</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleStatusUpdate('shortlist')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      decision === 'shortlist'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Shortlist
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('hold')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      decision === 'hold'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline mr-2" />
                    Hold
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('reject')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      decision === 'reject'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    <XCircle className="w-4 h-4 inline mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => setDecision('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      decision === 'pending'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Pending
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateReview;
