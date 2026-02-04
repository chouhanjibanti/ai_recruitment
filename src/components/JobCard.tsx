import React from 'react';
import { type Job } from '../types';
import { Briefcase, MapPin, DollarSign, Clock, Users } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onView?: () => void;
  onApply?: () => void;
  showApplyButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onView, 
  onApply, 
  showApplyButton = false 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{job.department}</p>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>
        <button 
          onClick={onView}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </button>
      </div>

      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {job.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase className="w-4 h-4 mr-2" />
          {job.type} • {job.experience}
        </div>
        {job.salary && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          {job.applicantCount} applicants
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {job.skills.slice(0, 4).map((skill, index) => (
          <span 
            key={index}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
            +{job.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          Posted {job.postedAt}
        </div>
        {showApplyButton && (
          <button
            onClick={onApply}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
