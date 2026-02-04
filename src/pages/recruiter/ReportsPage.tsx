import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  DollarSign,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  FileText,
  Eye
} from 'lucide-react';

interface ReportData {
  id: string;
  title: string;
  type: 'hiring' | 'performance' | 'cost' | 'time' | 'diversity';
  period: string;
  generatedAt: string;
  status: 'completed' | 'generating' | 'scheduled';
  downloadUrl?: string;
}

interface Metric {
  label: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [reports, setReports] = useState<ReportData[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [hiringFunnelData, setHiringFunnelData] = useState<ChartData[]>([]);
  const [timeToHireData, setTimeToHireData] = useState<ChartData[]>([]);
  const [costPerHireData, setCostPerHireData] = useState<ChartData[]>([]);
  const [sourceEffectivenessData, setSourceEffectivenessData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newReportType, setNewReportType] = useState('');
  const [newReportPeriod, setNewReportPeriod] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

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
          downloadUrl: '/reports/monthly-hiring-jan-2024.pdf'
        },
        {
          id: '2',
          title: 'Recruitment Cost Analysis',
          type: 'cost',
          period: 'Q4 2023',
          generatedAt: '2024-01-15T14:30:00Z',
          status: 'completed',
          downloadUrl: '/reports/cost-analysis-q4-2023.pdf'
        },
        {
          id: '3',
          title: 'Time to Hire Analysis',
          type: 'time',
          period: 'Last 90 Days',
          generatedAt: '2024-01-20T09:15:00Z',
          status: 'completed',
          downloadUrl: '/reports/time-to-hire-90days.pdf'
        },
        {
          id: '4',
          title: 'Diversity & Inclusion Report',
          type: 'diversity',
          period: '2023 Annual',
          generatedAt: '2024-01-01T00:00:00Z',
          status: 'completed',
          downloadUrl: '/reports/diversity-2023.pdf'
        },
        {
          id: '5',
          title: 'Weekly Pipeline Performance',
          type: 'performance',
          period: 'Week 4, January 2024',
          generatedAt: '2024-01-25T16:45:00Z',
          status: 'generating'
        }
      ];

      const mockMetrics: Metric[] = [
        {
          label: 'Total Hires',
          value: 47,
          change: 12.5,
          changeType: 'increase',
          icon: <Users className="w-5 h-5" />,
          color: 'bg-blue-500'
        },
        {
          label: 'Avg. Time to Hire',
          value: '28 days',
          change: -8.2,
          changeType: 'decrease',
          icon: <Clock className="w-5 h-5" />,
          color: 'bg-green-500'
        },
        {
          label: 'Cost per Hire',
          value: '$4,250',
          change: 5.3,
          changeType: 'increase',
          icon: <DollarSign className="w-5 h-5" />,
          color: 'bg-purple-500'
        },
        {
          label: 'Offer Acceptance Rate',
          value: '87%',
          change: 3.1,
          changeType: 'increase',
          icon: <Target className="w-5 h-5" />,
          color: 'bg-orange-500'
        }
      ];

      const mockHiringFunnel: ChartData[] = [
        { name: 'Applications', value: 1250, color: '#3B82F6' },
        { name: 'Screened', value: 450, color: '#8B5CF6' },
        { name: 'Interviewed', value: 180, color: '#F59E0B' },
        { name: 'Offered', value: 65, color: '#10B981' },
        { name: 'Hired', value: 47, color: '#06B6D4' }
      ];

      const mockTimeToHire: ChartData[] = [
        { name: 'Jan', value: 32 },
        { name: 'Feb', value: 28 },
        { name: 'Mar', value: 35 },
        { name: 'Apr', value: 30 },
        { name: 'May', value: 26 },
        { name: 'Jun', value: 28 }
      ];

      const mockCostPerHire: ChartData[] = [
        { name: 'Job Boards', value: 1200 },
        { name: 'Recruiter Fees', value: 2800 },
        { name: 'Advertising', value: 800 },
        { name: 'Referral Bonus', value: 1500 },
        { name: 'Other', value: 450 }
      ];

      const mockSourceEffectiveness: ChartData[] = [
        { name: 'LinkedIn', value: 35, color: '#0077B5' },
        { name: 'Company Website', value: 25, color: '#10B981' },
        { name: 'Employee Referral', value: 20, color: '#F59E0B' },
        { name: 'Job Boards', value: 15, color: '#8B5CF6' },
        { name: 'Social Media', value: 5, color: '#EC4899' }
      ];

      setReports(mockReports);
      setMetrics(mockMetrics);
      setHiringFunnelData(mockHiringFunnel);
      setTimeToHireData(mockTimeToHire);
      setCostPerHireData(mockCostPerHire);
      setSourceEffectivenessData(mockSourceEffectiveness);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType;
    return matchesType;
  });

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'hiring':
        return 'bg-blue-100 text-blue-800';
      case 'performance':
        return 'bg-green-100 text-green-800';
      case 'cost':
        return 'bg-purple-100 text-purple-800';
      case 'time':
        return 'bg-orange-100 text-orange-800';
      case 'diversity':
        return 'bg-pink-100 text-pink-800';
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

  const viewReportDetails = (report: ReportData) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const downloadReport = (report: ReportData) => {
    // Create a mock PDF content for download
    const reportContent = `
Report Title: ${report.title}
Report Type: ${report.type}
Period: ${report.period}
Generated: ${new Date(report.generatedAt).toLocaleString()}

=== REPORT SUMMARY ===
This is a comprehensive ${report.type} report for the period ${report.period}.

Key Metrics:
- Total Hires: 47
- Average Time to Hire: 28 days
- Cost per Hire: $4,250
- Offer Acceptance Rate: 87%

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
    
    // Show success notification
    showNotification(`Report "${report.title}" downloaded successfully!`, 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateNewReport = () => {
    setShowGenerateModal(true);
  };

  const handleGenerateReport = async () => {
    if (!newReportType || !newReportPeriod) {
      showNotification('Please select both report type and period', 'error');
      return;
    }

    // Create new report with generating status
    const newReport: ReportData = {
      id: Date.now().toString(),
      title: `${newReportType.charAt(0).toUpperCase() + newReportType.slice(1)} Report - ${newReportPeriod}`,
      type: newReportType as ReportData['type'],
      period: newReportPeriod,
      generatedAt: new Date().toISOString(),
      status: 'generating'
    };

    // Add to reports list immediately
    setReports(prev => [newReport, ...prev]);
    setShowGenerateModal(false);
    setNewReportType('');
    setNewReportPeriod('');

    // Show generation started notification
    showNotification(`Started generating "${newReport.title}"`, 'info');

    // Simulate report generation with progress
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { 
              ...report, 
              status: 'completed' as const,
              downloadUrl: `/reports/${report.id}.pdf`
            }
          : report
      ));
      
      // Show completion notification
      showNotification(`Report "${newReport.title}" generated successfully!`, 'success');
    }, 3000);
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
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Track recruitment metrics and generate insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className={`${metric.color} p-3 rounded-full text-white`}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Hiring Funnel Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hiring Funnel</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {hiringFunnelData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24">{item.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${(item.value / hiringFunnelData[0].value) * 100}%`,
                      backgroundColor: item.color
                    }}
                  >
                    <span className="text-xs text-white font-medium">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time to Hire Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Time to Hire Trend</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {timeToHireData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">{item.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.value / 40) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.value}d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost per Hire Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cost per Hire Breakdown</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {costPerHireData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28">{item.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.value / 3000) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">${item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Effectiveness */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Source Effectiveness</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {sourceEffectivenessData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24">{item.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color
                    }}
                  >
                    <span className="text-xs text-white font-medium">{item.value}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>
            <div className="flex items-center gap-3">
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="hiring">Hiring</option>
                <option value="performance">Performance</option>
                <option value="cost">Cost</option>
                <option value="time">Time</option>
                <option value="diversity">Diversity</option>
              </select>
              <button 
                onClick={generateNewReport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
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
                        onClick={() => viewReportDetails(report)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {report.status === 'completed' && (
                        <button
                          onClick={() => downloadReport(report)}
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
                  This report provides comprehensive insights into recruitment metrics and performance indicators 
                  for the specified period. It includes detailed analysis of hiring funnel efficiency, 
                  time-to-hire trends, cost breakdowns, and source effectiveness.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Key Insights</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Overall hiring efficiency improved by 12% compared to previous period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Time-to-hire reduced by 8 days through process optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Cost per hire increased by 5% due to market competition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Employee referrals show highest conversion rate at 85%</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                {selectedReport.status === 'completed' && (
                  <button
                    onClick={() => downloadReport(selectedReport)}
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

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Generate New Report</h2>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={newReportType}
                    onChange={(e) => setNewReportType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select report type</option>
                    <option value="hiring">Hiring Report</option>
                    <option value="performance">Performance Report</option>
                    <option value="cost">Cost Analysis</option>
                    <option value="time">Time to Hire Analysis</option>
                    <option value="diversity">Diversity & Inclusion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period
                  </label>
                  <select
                    value={newReportPeriod}
                    onChange={(e) => setNewReportPeriod(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select period</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="Last 90 Days">Last 90 Days</option>
                    <option value="This Month">This Month</option>
                    <option value="Last Month">Last Month</option>
                    <option value="This Quarter">This Quarter</option>
                    <option value="Last Quarter">Last Quarter</option>
                    <option value="This Year">This Year</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleGenerateReport}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate Report
                </button>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
