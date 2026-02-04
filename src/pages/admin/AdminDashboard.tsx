import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidatesAsync } from '../../store/slices/candidatesSlice';
import { fetchJobsAsync } from '../../store/slices/jobsSlice';
import { selectCandidatesList } from '../../store/slices/candidatesSlice';
import { selectJobsList } from '../../store/slices/jobsSlice';
import { selectInterviewSessions } from '../../store/slices/interviewsSlice';
import { Users, Briefcase, Calendar, TrendingUp, AlertCircle, Settings, FileText, Activity, BarChart3 } from 'lucide-react';
import InterviewAnalytics from '../../components/charts/InterviewAnalytics';
import HiringMetrics from '../../components/charts/HiringMetrics';

interface SystemMetrics {
  totalUsers: number;
  totalJobs: number;
  totalCandidates: number;
  totalInterviews: number;
  activeInterviews: number;
  completedInterviews: number;
  avgTimeToHire: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  
  const candidates = useSelector(selectCandidatesList);
  const jobs = useSelector(selectJobsList);
  const interviews = useSelector(selectInterviewSessions);
  
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    totalJobs: 0,
    totalCandidates: 0,
    totalInterviews: 0,
    activeInterviews: 0,
    completedInterviews: 0,
    avgTimeToHire: 0,
    systemHealth: 'healthy',
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: '1',
      type: 'user_created',
      message: 'New user registered: john.doe@example.com',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      severity: 'info',
    },
    {
      id: '2',
      type: 'job_created',
      message: 'New job posted: Senior Frontend Developer',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      severity: 'info',
    },
    {
      id: '3',
      type: 'interview_completed',
      message: 'Interview completed for Jane Smith',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      severity: 'success',
    },
    {
      id: '4',
      type: 'system_error',
      message: 'Resume parsing service temporarily unavailable',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      severity: 'error',
    },
  ]);

  useEffect(() => {
    dispatch(fetchCandidatesAsync());
    dispatch(fetchJobsAsync());
  }, [dispatch]);

  useEffect(() => {
    setMetrics({
      totalUsers: 156,
      totalJobs: jobs.length,
      totalCandidates: candidates.length,
      totalInterviews: interviews.length,
      activeInterviews: interviews.filter(i => i.status === 'LIVE').length,
      completedInterviews: interviews.filter(i => i.status === 'COMPLETED').length,
      avgTimeToHire: 28,
      systemHealth: 'healthy',
    });
  }, [candidates, jobs, interviews]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ReactNode;
    trend?: number;
    color?: string;
  }> = ({ title, value, icon, trend, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center text-sm ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
              <span className="ml-1">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </div>

      {/* System Health */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(metrics.systemHealth)}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            metrics.systemHealth === 'healthy' ? 'bg-green-500' : 
            metrics.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          System Status: {metrics.systemHealth}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          trend={12}
          color="blue"
        />
        <MetricCard
          title="Active Jobs"
          value={metrics.totalJobs}
          icon={<Briefcase className="w-6 h-6 text-green-600" />}
          trend={8}
          color="green"
        />
        <MetricCard
          title="Total Candidates"
          value={metrics.totalCandidates}
          icon={<FileText className="w-6 h-6 text-purple-600" />}
          trend={15}
          color="purple"
        />
        <MetricCard
          title="Active Interviews"
          value={metrics.activeInterviews}
          icon={<Calendar className="w-6 h-6 text-orange-600" />}
          trend={5}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Analytics</h3>
          <InterviewAnalytics />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Metrics</h3>
          <HiringMetrics />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(activity.severity)}`}>
                    {activity.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Users className="w-4 h-4" />
                <span>Manage Users</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Briefcase className="w-4 h-4" />
                <span>View Jobs</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <FileText className="w-4 h-4" />
                <span>Candidates</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Interviews</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span>Reports</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Interview Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-medium text-gray-900">87%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Duration</span>
                <span className="font-medium text-gray-900">45 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Score</span>
                <span className="font-medium text-gray-900">82/100</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Hiring Pipeline</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Time to Hire</span>
                <span className="font-medium text-gray-900">{metrics.avgTimeToHire} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Applications/Job</span>
                <span className="font-medium text-gray-900">23.5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Offer Acceptance</span>
                <span className="font-medium text-gray-900">78%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">System Usage</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Daily Active Users</span>
                <span className="font-medium text-gray-900">142</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">API Calls Today</span>
                <span className="font-medium text-gray-900">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Storage Used</span>
                <span className="font-medium text-gray-900">2.3 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
