import React from 'react';
import { Users, Briefcase, Calendar, TrendingUp, FileText, Settings } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Jobs',
      value: '45',
      change: '+8%',
      icon: Briefcase,
      color: 'bg-green-500'
    },
    {
      title: 'Total Candidates',
      value: '892',
      change: '+23%',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Interviews Today',
      value: '28',
      change: '+5%',
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'created new job', target: 'Senior Developer', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'scheduled interview', target: 'Frontend Developer', time: '3 hours ago' },
    { id: 3, user: 'Mike Johnson', action: 'updated pipeline', target: 'Engineering Team', time: '5 hours ago' },
    { id: 4, user: 'Sarah Wilson', action: 'generated report', target: 'Monthly Analytics', time: '1 day ago' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Export Data
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user} {activity.action} <span className="text-blue-600">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Manage Users</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Briefcase className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">View All Jobs</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">View Reports</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">System Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
