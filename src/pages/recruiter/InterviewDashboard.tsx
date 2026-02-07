import React, { useState } from 'react';
import { useInterviewSessions } from '../../hooks/useMongoDB';
import { Video, Users, CheckCircle, Clock, AlertCircle, TrendingUp, RefreshCw, Activity, Target, BarChart3 } from 'lucide-react';

const InterviewDashboard: React.FC = () => {
  const { sessions, loading } = useInterviewSessions();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paused': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active': return <Video className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'paused': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100';
    if (score >= 0.6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Calculate statistics
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const activeSessions = sessions.filter(s => s.status === 'active');
  const scheduledSessions = sessions.filter(s => s.status === 'scheduled');
  const todayCompleted = completedSessions.filter(s => 
    new Date(s.completed_at || '').toDateString() === new Date().toDateString()
  );
  const todayActive = sessions.filter(s => 
    new Date(s.started_at || '').toDateString() === new Date().toDateString()
  );

  const averageScore = completedSessions.length > 0 
    ? completedSessions.reduce((acc, s) => acc + (s.overall_score || 0), 0) / completedSessions.length
    : 0;

  const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0;
  const averageDuration = completedSessions.length > 0 
    ? completedSessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / completedSessions.length
    : 0;

  // Performance metrics
  const highScoringSessions = completedSessions.filter(s => (s.overall_score || 0) >= 0.8);
  const mediumScoringSessions = completedSessions.filter(s => (s.overall_score || 0) >= 0.6 && (s.overall_score || 0) < 0.8);
  const lowScoringSessions = completedSessions.filter(s => (s.overall_score || 0) < 0.6);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading interview data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-600 mt-1">Monitor interview sessions and candidate performance</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Session Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalSessions}</p>
              <p className="text-sm text-gray-500 mt-1">All interviews</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{completedSessions.length}</p>
              <p className="text-sm text-gray-500 mt-1">{completionRate.toFixed(1)}% completion rate</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Now</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{activeSessions.length}</p>
              <p className="text-sm text-gray-500 mt-1">Live interviews</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className={`text-3xl font-bold mt-2 ${getScoreColor(averageScore)}`}>
                {averageScore > 0 ? (averageScore * 100).toFixed(1) : 'N/A'}
              </p>
              <p className="text-sm text-gray-500 mt-1">Overall performance</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Activity Tracking */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Today's Activity</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Today</p>
                  <p className="text-2xl font-bold text-blue-900">{todayActive.length}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Completed Today</p>
                  <p className="text-2xl font-bold text-green-900">{todayCompleted.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Scheduled Today</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {scheduledSessions.filter(s => 
                      new Date(s.started_at || '').toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Avg Score Today</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {todayCompleted.length > 0 
                      ? (todayCompleted.reduce((acc, s) => acc + (s.overall_score || 0), 0) / todayCompleted.length * 100).toFixed(1)
                      : 'N/A'
                    }
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{completionRate.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Duration</span>
              <span className="text-sm font-medium text-gray-900">
                {averageDuration > 0 ? `${averageDuration.toFixed(0)} min` : 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Score</span>
              <span className={`text-sm font-medium ${getScoreColor(averageScore)}`}>
                {averageScore > 0 ? `${(averageScore * 100).toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-medium text-green-600">
                {highScoringSessions.length > 0 ? 
                  `${(highScoringSessions.length / completedSessions.length * 100).toFixed(1)}%` : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-800">High Score (≥80%)</span>
              </div>
              <span className="text-sm font-bold text-green-900">{highScoringSessions.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-yellow-800">Medium Score (60-79%)</span>
              </div>
              <span className="text-sm font-bold text-yellow-900">{mediumScoringSessions.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-red-800">Low Score (&lt;60%)</span>
              </div>
              <span className="text-sm font-bold text-red-900">{lowScoringSessions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Interview Sessions</h3>
            </div>
            <span className="text-sm text-gray-500">Last {Math.min(10, sessions.length)} sessions</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.slice(0, 10).map((session) => (
                <tr key={session.session_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">{session.session_id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{session.candidate_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.job_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      session.interview_mode === 'technical' ? 'bg-blue-100 text-blue-800' :
                      session.interview_mode === 'behavioral' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.interview_mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1 capitalize">{session.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.overall_score ? (
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${getScoreColor(session.overall_score)}`}>
                          {(session.overall_score * 100).toFixed(1)}%
                        </span>
                        <div className={`ml-2 w-2 h-2 rounded-full ${
                          session.overall_score >= 0.8 ? 'bg-green-500' :
                          session.overall_score >= 0.6 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {session.duration_minutes ? `${session.duration_minutes} min` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div>
                      <p>{new Date(session.started_at || '').toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.started_at || '').toLocaleTimeString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 font-medium mr-3">
                      View Details
                    </button>
                    {session.status === 'completed' && (
                      <button className="text-green-600 hover:text-green-900 font-medium">
                        View Report
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sessions.length === 0 && (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No interview sessions found</p>
              <p className="text-sm text-gray-400 mt-2">Sessions will appear here once interviews are conducted</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewDashboard;
 

