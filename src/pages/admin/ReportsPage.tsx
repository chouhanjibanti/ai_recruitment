import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  Eye,
  Clock,
  DollarSign,
  Target,
  Activity,
  PieChart,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings
} from 'lucide-react';

interface ReportData {
  id: string;
  title: string;
  type: 'hiring' | 'performance' | 'financial' | 'user' | 'system';
  period: string;
  generatedAt: string;
  status: 'completed' | 'generating' | 'scheduled';
  downloadUrl?: string;
  fileSize: string;
}

interface SystemMetrics {
  totalUsers: number;
  activeJobs: number;
  totalApplications: number;
  systemUptime: string;
  serverLoad: number;
  storageUsed: number;
  apiCalls: number;
  errorRate: number;
}

interface HiringMetrics {
  totalHires: number;
  avgTimeToHire: number;
  costPerHire: number;
  offerAcceptanceRate: number;
  sourceEffectiveness: { [key: string]: number };
  departmentBreakdown: { [key: string]: number };
}

const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [hiringMetrics, setHiringMetrics] = useState<HiringMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockReports: ReportData[] = [
        {
          id: '1',
          title: 'Monthly Hiring Performance Report',
          type: 'hiring',
          period: 'January 2024',
          generatedAt: '2024-01-31T10:00:00Z',
          status: 'completed',
          downloadUrl: '/reports/monthly-hiring-jan-2024.pdf',
          fileSize: '2.4 MB'
        },
        {
          id: '2',
          title: 'System Performance Analysis',
          type: 'system',
          period: 'Q4 2023',
          generatedAt: '2024-01-15T14:30:00Z',
          status: 'completed',
          downloadUrl: '/reports/system-performance-q4-2023.pdf',
          fileSize: '1.8 MB'
        },
        {
          id: '3',
          title: 'User Activity Report',
          type: 'user',
          period: 'Last 90 Days',
          generatedAt: '2024-01-20T09:15:00Z',
          status: 'completed',
          downloadUrl: '/reports/user-activity-90days.pdf',
          fileSize: '3.1 MB'
        },
        {
          id: '4',
          title: 'Financial Summary',
          type: 'financial',
          period: '2023 Annual',
          generatedAt: '2024-01-01T00:00:00Z',
          status: 'completed',
          downloadUrl: '/reports/financial-summary-2023.pdf',
          fileSize: '4.2 MB'
        },
        {
          id: '5',
          title: 'Weekly System Health Check',
          type: 'system',
          period: 'Week 4, January 2024',
          generatedAt: '2024-01-25T16:45:00Z',
          status: 'generating',
          fileSize: '0 MB'
        }
      ];

      const mockSystemMetrics: SystemMetrics = {
        totalUsers: 1247,
        activeJobs: 89,
        totalApplications: 3421,
        systemUptime: '99.9%',
        serverLoad: 45,
        storageUsed: 67,
        apiCalls: 125000,
        errorRate: 0.2
      };

      const mockHiringMetrics: HiringMetrics = {
        totalHires: 156,
        avgTimeToHire: 28,
        costPerHire: 4250,
        offerAcceptanceRate: 87,
        sourceEffectiveness: {
          'LinkedIn': 35,
          'Company Website': 25,
          'Employee Referral': 20,
          'Job Boards': 15,
          'Social Media': 5
        },
        departmentBreakdown: {
          'Engineering': 45,
          'Sales': 32,
          'Marketing': 28,
          'HR': 25,
          'Finance': 18,
          'Operations': 8
        }
      };

      setReports(mockReports);
      setSystemMetrics(mockSystemMetrics);
      setHiringMetrics(mockHiringMetrics);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType;
    return matchesSearch && matchesType;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleDownloadReport = (report: ReportData) => {
    // Create a mock PDF content for download
    const reportContent = `
Report Title: ${report.title}
Report Type: ${report.type}
Period: ${report.period}
Generated: ${new Date(report.generatedAt).toLocaleString()}

=== SYSTEM-WIDE REPORT SUMMARY ===
This is a comprehensive ${report.type} report for the period ${report.period}.

System Metrics:
- Total Users: ${systemMetrics?.totalUsers}
- Active Jobs: ${systemMetrics?.activeJobs}
- Total Applications: ${systemMetrics?.totalApplications}
- System Uptime: ${systemMetrics?.systemUptime}
- Server Load: ${systemMetrics?.serverLoad}%
- Storage Used: ${systemMetrics?.storageUsed}%
- API Calls: ${systemMetrics?.apiCalls}
- Error Rate: ${systemMetrics?.errorRate}%

Hiring Metrics:
- Total Hires: ${hiringMetrics?.totalHires}
- Avg Time to Hire: ${hiringMetrics?.avgTimeToHire} days
- Cost per Hire: $${hiringMetrics?.costPerHire}
- Offer Acceptance Rate: ${hiringMetrics?.offerAcceptanceRate}%

Detailed analysis and insights would be included in the actual report.
`;

    // Create a Blob with the content
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '_')}_${report.period.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
  };

  const handleViewReport = (report: ReportData) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'hiring':
        return 'bg-blue-100 text-blue-800';
      case 'performance':
        return 'bg-green-100 text-green-800';
      case 'financial':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-orange-100 text-orange-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'generating':
        return <Activity className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">System Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into system performance and recruitment metrics</p>
      </div>

      {/* System Metrics Overview */}
      {systemMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.activeJobs}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.totalApplications.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">{systemMetrics.systemUptime}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hiring Analytics */}
      {hiringMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Hiring Metrics</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{hiringMetrics.totalHires}</p>
                <p className="text-sm text-gray-600">Total Hires</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{hiringMetrics.avgTimeToHire}d</p>
                <p className="text-sm text-gray-600">Avg. Time to Hire</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">${hiringMetrics.costPerHire.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Cost per Hire</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{hiringMetrics.offerAcceptanceRate}%</p>
                <p className="text-sm text-gray-600">Offer Acceptance</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Source Effectiveness</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {Object.entries(hiringMetrics.sourceEffectiveness).map(([source, percentage]) => (
                <div key={source} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32">{source}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-xs text-white font-medium">{percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="hiring">Hiring</option>
                <option value="performance">Performance</option>
                <option value="financial">Financial</option>
                <option value="user">User</option>
                <option value="system">System</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getReportTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(report.generatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.fileSize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <span className="text-sm text-gray-900">
                        {report.status === 'generating' ? 'Generating...' : report.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {report.status === 'completed' && (
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedReport.title}</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Report Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getReportTypeColor(selectedReport.type)}`}>
                        {selectedReport.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Period:</span>
                      <span className="ml-2 text-gray-900">{selectedReport.period}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Generated:</span>
                      <span className="ml-2 text-gray-900">{new Date(selectedReport.generatedAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">File Size:</span>
                      <span className="ml-2 text-gray-900">{selectedReport.fileSize}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Status</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedReport.status)}
                    <span className="text-sm text-gray-900">{selectedReport.status}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                <p className="text-sm text-gray-600">
                  This comprehensive system-wide report provides detailed insights into {selectedReport.type} metrics 
                  for the period {selectedReport.period}. It includes detailed analysis, performance indicators, 
                  and actionable recommendations for system optimization.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Key Insights</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>System performance improved by 15% compared to previous period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>User engagement increased by 22% with new features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Server load requires optimization during peak hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Cost efficiency improved by 8% through process optimization</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                {selectedReport.status === 'completed' && (
                  <button
                    onClick={() => handleDownloadReport(selectedReport)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                )}
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;
