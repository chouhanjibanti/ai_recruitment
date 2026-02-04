import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, Calendar, CheckCircle, Clock, TrendingUp, User } from 'lucide-react';

const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: 'Applications',
      value: '12',
      change: '3 pending',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Interviews Scheduled',
      value: '3',
      change: '1 this week',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Profile Views',
      value: '45',
      change: '+12 this week',
      icon: User,
      color: 'bg-purple-500'
    },
    {
      title: 'Saved Jobs',
      value: '8',
      change: '2 new matches',
      icon: Briefcase,
      color: 'bg-orange-500'
    }
  ];

  const recentApplications = [
    {
      id: 1,
      company: 'Tech Corp',
      position: 'Senior Frontend Developer',
      status: 'Interview Scheduled',
      applied: '3 days ago',
      nextStep: 'Technical Interview - Tomorrow'
    },
    {
      id: 2,
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      status: 'Under Review',
      applied: '1 week ago',
      nextStep: 'Awaiting response'
    },
    {
      id: 3,
      company: 'Enterprise Inc',
      position: 'React Developer',
      status: 'Application Sent',
      applied: '2 weeks ago',
      nextStep: 'Application received'
    }
  ];

  const handleProfileClick = () => {
    navigate('/candidate/profile');
  };

  const recommendedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Solutions',
      location: 'Remote',
      type: 'Full-time',
      match: '95%'
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      company: 'Digital Agency',
      location: 'New York',
      type: 'Full-time',
      match: '88%'
    },
    {
      id: 3,
      title: 'UI/UX Developer',
      company: 'Design Studio',
      location: 'San Francisco',
      type: 'Contract',
      match: '82%'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interview Scheduled': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Application Sent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/candidate/jobs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
          <button 
            onClick={() => navigate('/candidate/profile')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Update Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div 
                onClick={handleProfileClick}
                className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-gray-400 transition-colors"
                title="Click to view profile"
              >
                <User className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
              <p className="text-sm text-gray-600">Senior Frontend Developer</p>
              <p className="text-xs text-gray-500 mt-1">john.doe@example.com</p>
              <button
                onClick={handleProfileClick}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.slice(0, 3).map((stat, index) => {
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
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {stats.slice(3, 4).map((stat, index) => {
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
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{application.position}</p>
                      <p className="text-xs text-gray-500">{application.company} • {application.applied}</p>
                      <p className="text-xs text-gray-600 mt-1">{application.nextStep}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recommended Jobs</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.company} • {job.location}</p>
                      <p className="text-xs text-gray-600 mt-1">{job.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {job.match} match
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        Apply
                      </button>
                    </div>
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

export default CandidateDashboard;
