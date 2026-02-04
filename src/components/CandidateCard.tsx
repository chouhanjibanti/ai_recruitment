import React from 'react';
import { type Candidate } from '../types';
import { User, Mail, Phone, Briefcase, GraduationCap, MapPin } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onView?: () => void;
  onSchedule?: () => void;
  showScheduleButton?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  onView, 
  onSchedule, 
  showScheduleButton = false 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'employed': return 'bg-blue-100 text-blue-800';
      case 'interviewing': return 'bg-yellow-100 text-yellow-800';
      case 'offered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
            <p className="text-sm text-gray-600">{candidate.currentStatus.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>
        <button 
          onClick={onView}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Profile
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {candidate.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {candidate.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase className="w-4 h-4 mr-2" />
          {candidate.experience} years experience
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {candidate.preferredLocation.join(', ')}
        </div>
        {candidate.expectedSalary && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Expected: </span>
            {candidate.expectedSalary.currency} {candidate.expectedSalary.min.toLocaleString()} - {candidate.expectedSalary.max.toLocaleString()}
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Education</h4>
        <div className="text-sm text-gray-600">
          {candidate.education[0]?.degree} from {candidate.education[0]?.institution} ({candidate.education[0]?.year})
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
        <div className="flex flex-wrap gap-1">
          {candidate.skills.slice(0, 6).map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 6 && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
              +{candidate.skills.length - 6} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <span className="font-medium">Updated:</span> {candidate.updatedAt}
        </div>
        {showScheduleButton && (
          <button
            onClick={onSchedule}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
          >
            Schedule Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
