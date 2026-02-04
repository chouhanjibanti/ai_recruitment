import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Calendar, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: 'Active Jobs',
      value: '12',
      change: '+2 this week',
      icon: Briefcase,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Candidates',
      value: '234',
      change: '+18 this week',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Interviews Today',
      value: '8',
      change: '3 upcoming',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Avg. Time to Hire',
      value: '18 days',
      change: '-3 days',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  const recentJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      applicants: 45,
      status: 'active',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      applicants: 32,
      status: 'active',
      posted: '5 days ago'
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      applicants: 28,
      status: 'closing',
      posted: '1 week ago'
    }
  ];

  const upcomingInterviews = [
    {
      id: 1,
      candidate: 'Alice Johnson',
      position: 'Frontend Developer',
      time: '10:00 AM',
      status: 'READY'
    },
    {
      id: 2,
      candidate: 'Bob Smith',
      position: 'Backend Developer',
      time: '2:00 PM',
      status: 'READY'
    },
    {
      id: 3,
      candidate: 'Carol Williams',
      position: 'DevOps Engineer',
      time: '4:00 PM',
      status: 'LIVE'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-yellow-100 text-yellow-800';
      case 'LIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/recruiter/create-job')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post New Job
          </button>
          <button 
            onClick={() => navigate('/recruiter/schedule-interview')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Schedule Interview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Job Postings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.department} • {job.posted}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{job.applicants} applicants</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Today's Interviews</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{interview.candidate}</p>
                    <p className="text-xs text-gray-500">{interview.position}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{interview.time}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
