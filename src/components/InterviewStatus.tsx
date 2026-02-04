import React from 'react';
import { type InterviewStatus } from '../types';
import { Circle, Play, CheckCircle, XCircle, Clock } from 'lucide-react';

interface InterviewStatusProps {
  status: InterviewStatus;
  candidateName: string;
  position: string;
  scheduledTime: string;
  duration?: number;
  onJoin?: () => void;
  onView?: () => void;
}

const InterviewStatusComponent: React.FC<InterviewStatusProps> = ({
  status,
  candidateName,
  position,
  scheduledTime,
  duration = 60,
  onJoin,
  onView
}) => {
  const getStatusConfig = (status: InterviewStatus) => {
    switch (status) {
      case 'READY':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Ready to Start',
          actionText: 'Start Interview',
          actionColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'LIVE':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Play,
          label: 'Live Now',
          actionText: 'Join Interview',
          actionColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'COMPLETED':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircle,
          label: 'Completed',
          actionText: 'View Results',
          actionColor: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Cancelled',
          actionText: 'View Details',
          actionColor: 'bg-gray-600 hover:bg-gray-700'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Circle,
          label: 'Unknown',
          actionText: 'View Details',
          actionColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  const handleAction = () => {
    if (status === 'LIVE' && onJoin) {
      onJoin();
    } else if (status === 'READY' && onJoin) {
      onJoin();
    } else if (onView) {
      onView();
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${config.color}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <StatusIcon className="w-5 h-5" />
          <span className="font-medium">{config.label}</span>
        </div>
        <div className="text-sm">
          {duration} minutes
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-semibold text-gray-900">{candidateName}</h4>
        <p className="text-sm text-gray-600">{position}</p>
        <p className="text-xs text-gray-500 mt-1">
          Scheduled: {scheduledTime}
        </p>
      </div>

      {status === 'LIVE' && (
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Interview in progress</span>
          </div>
        </div>
      )}

      <button
        onClick={handleAction}
        className={`w-full px-4 py-2 text-white font-medium rounded transition-colors ${config.actionColor}`}
      >
        {config.actionText}
      </button>
    </div>
  );
};

export default InterviewStatusComponent;
