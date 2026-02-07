import React, { useState } from 'react';
import { useResumes } from '../../hooks/useMongoDB';
import { FileText, Upload, CheckCircle, Clock, AlertCircle, RefreshCw, TrendingUp, Activity } from 'lucide-react';

const ResumeDashboard: React.FC = () => {
  const { resumes, loading } = useResumes();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'parsed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing': return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Upload className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'parsed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalResumes = resumes.length;
  const parsedResumes = resumes.filter(r => r.status === 'parsed').length;
  const processingResumes = resumes.filter(r => r.status === 'processing').length;
  const errorResumes = resumes.filter(r => r.status === 'error').length;
  const uploadedResumes = resumes.filter(r => r.status === 'uploaded').length;

  const processingRate = totalResumes > 0 ? ((parsedResumes / totalResumes) * 100).toFixed(1) : '0';
  const errorRate = totalResumes > 0 ? ((errorResumes / totalResumes) * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading resume data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Management</h1>
          <p className="text-gray-600 mt-1">Track and manage resume processing status</p>
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

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Resumes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalResumes}</p>
              <p className="text-sm text-gray-500 mt-1">All time uploads</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Successfully Parsed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{parsedResumes}</p>
              <p className="text-sm text-gray-500 mt-1">{processingRate}% success rate</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{processingResumes}</p>
              <p className="text-sm text-gray-500 mt-1">In progress</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{errorResumes}</p>
              <p className="text-sm text-gray-500 mt-1">{errorRate}% error rate</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Processing Status Breakdown */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Real-time Status Tracking</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['uploaded', 'processing', 'parsed', 'error'].map(status => {
              const count = resumes.filter(r => r.status === status).length;
              const percentage = totalResumes > 0 ? (count / totalResumes) * 100 : 0;
              
              return (
                <div key={status} className="relative">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      {getStatusIcon(status)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 capitalize">{status}</p>
                        <p className="text-xs text-gray-500">{count} resumes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        status === 'parsed' ? 'bg-green-500' :
                        status === 'processing' ? 'bg-yellow-500' :
                        status === 'error' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Uploads</h3>
            </div>
            <span className="text-sm text-gray-500">Last {Math.min(10, resumes.length)} uploads</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resumes.slice(0, 10).map((resume, index) => (
                <tr key={resume.resume_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{resume.filename}</p>
                        <p className="text-xs text-gray-500">
                          {resume.file_size ? `${(resume.file_size / 1024 / 1024).toFixed(2)} MB` : 'Size unknown'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {resume.parsed_data?.personal_info?.name || 'Unknown'}
                      </p>
                      <p className="text-gray-500">
                        {resume.parsed_data?.personal_info?.email || 'No email'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(resume.status)}`}>
                        {getStatusIcon(resume.status)}
                        <span className="ml-1 capitalize">{resume.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div>
                      <p>{new Date(resume.upload_timestamp || resume.created_at).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(resume.upload_timestamp || resume.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {resume.processing_time_ms ? (
                      <span>{(resume.processing_time_ms / 1000).toFixed(2)}s</span>
                    ) : resume.status === 'processing' ? (
                      <span className="text-yellow-600">In progress...</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {resumes.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No resumes found</p>
              <p className="text-sm text-gray-400 mt-2">Upload some resumes to see them here</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Analytics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Processing Time</span>
              <span className="text-sm font-medium text-gray-900">
                {resumes.filter(r => r.processing_time_ms).length > 0 
                  ? `${(resumes.filter(r => r.processing_time_ms).reduce((acc, r) => acc + (r.processing_time_ms || 0), 0) / resumes.filter(r => r.processing_time_ms).length / 1000).toFixed(2)}s`
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-medium text-green-600">{processingRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-medium text-red-600">{errorRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">File Type Distribution</h3>
          <div className="space-y-3">
            {['PDF', 'DOCX', 'TXT'].map(fileType => {
              const count = resumes.filter(r => r.filename?.toLowerCase().endsWith(fileType.toLowerCase())).length;
              const percentage = totalResumes > 0 ? (count / totalResumes) * 100 : 0;
              
              return (
                <div key={fileType} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{fileType} files</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDashboard;