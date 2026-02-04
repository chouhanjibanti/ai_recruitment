import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Building,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  FileText
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'executive';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'active' | 'inactive' | 'closed' | 'draft';
  postedDate: string;
  closingDate: string;
  applicationsCount: number;
  viewsCount: number;
  recruiter: {
    name: string;
    email: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  remote: boolean;
  urgent: boolean;
}

interface JobStats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  draftJobs: number;
  totalApplications: number;
  avgApplicationsPerJob: number;
  jobsByDepartment: { [key: string]: number };
  jobsByType: { [key: string]: number };
}

const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Job>('postedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          department: 'Engineering',
          location: 'San Francisco, CA',
          type: 'full-time',
          experience: 'senior',
          salary: { min: 120000, max: 180000, currency: 'USD' },
          status: 'active',
          postedDate: '2024-01-15',
          closingDate: '2024-03-15',
          applicationsCount: 45,
          viewsCount: 1250,
          recruiter: {
            name: 'Sarah Johnson',
            email: 'sarah.j@company.com'
          },
          description: 'We are looking for an experienced Frontend Developer to join our growing engineering team.',
          requirements: ['5+ years of experience', 'React expertise', 'TypeScript knowledge'],
          benefits: ['Health insurance', '401k', 'Remote work options'],
          skills: ['React', 'TypeScript', 'Node.js', 'CSS'],
          remote: true,
          urgent: false
        },
        {
          id: '2',
          title: 'Product Manager',
          department: 'Product',
          location: 'New York, NY',
          type: 'full-time',
          experience: 'mid',
          salary: { min: 90000, max: 140000, currency: 'USD' },
          status: 'active',
          postedDate: '2024-01-20',
          closingDate: '2024-03-20',
          applicationsCount: 32,
          viewsCount: 890,
          recruiter: {
            name: 'Michael Brown',
            email: 'michael.b@company.com'
          },
          description: 'Seeking a Product Manager to drive product strategy and development.',
          requirements: ['3+ years experience', 'Product strategy', 'Data analysis'],
          benefits: ['Stock options', 'Flexible hours', 'Professional development'],
          skills: ['Product Management', 'Analytics', 'Agile', 'SQL'],
          remote: false,
          urgent: true
        },
        {
          id: '3',
          title: 'UX Designer',
          department: 'Design',
          location: 'Remote',
          type: 'contract',
          experience: 'mid',
          salary: { min: 80, max: 120, currency: 'USD' },
          status: 'active',
          postedDate: '2024-01-25',
          closingDate: '2024-04-25',
          applicationsCount: 28,
          viewsCount: 650,
          recruiter: {
            name: 'Emily Davis',
            email: 'emily.d@company.com'
          },
          description: 'Looking for a talented UX Designer for a 6-month contract position.',
          requirements: ['Portfolio required', 'Figma expertise', 'User research'],
          benefits: ['Flexible schedule', 'Remote work', 'Creative environment'],
          skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
          remote: true,
          urgent: false
        },
        {
          id: '4',
          title: 'Marketing Intern',
          department: 'Marketing',
          location: 'Boston, MA',
          type: 'internship',
          experience: 'entry',
          salary: { min: 20, max: 25, currency: 'USD' },
          status: 'active',
          postedDate: '2024-02-01',
          closingDate: '2024-05-01',
          applicationsCount: 67,
          viewsCount: 450,
          recruiter: {
            name: 'Lisa Anderson',
            email: 'lisa.a@company.com'
          },
          description: 'Great opportunity for students to gain hands-on marketing experience.',
          requirements: ['Current student', 'Basic marketing knowledge', 'Strong communication'],
          benefits: ['Academic credit', 'Mentorship program', 'Potential full-time offer'],
          skills: ['Social Media', 'Content Writing', 'Analytics', 'Canva'],
          remote: false,
          urgent: false
        },
        {
          id: '5',
          title: 'Backend Engineer',
          department: 'Engineering',
          location: 'Austin, TX',
          type: 'full-time',
          experience: 'senior',
          salary: { min: 130000, max: 190000, currency: 'USD' },
          status: 'closed',
          postedDate: '2023-12-01',
          closingDate: '2024-02-01',
          applicationsCount: 89,
          viewsCount: 2100,
          recruiter: {
            name: 'Sarah Johnson',
            email: 'sarah.j@company.com'
          },
          description: 'Senior Backend Engineer position with focus on scalable systems.',
          requirements: ['7+ years experience', 'Cloud architecture', 'Database design'],
          benefits: ['Comprehensive health', 'Equity', 'Learning budget'],
          skills: ['Python', 'AWS', 'PostgreSQL', 'Docker'],
          remote: true,
          urgent: false
        },
        {
          id: '6',
          title: 'Data Analyst',
          department: 'Analytics',
          location: 'Chicago, IL',
          type: 'part-time',
          experience: 'mid',
          salary: { min: 60, max: 80, currency: 'USD' },
          status: 'draft',
          postedDate: '2024-02-02',
          closingDate: '2024-04-02',
          applicationsCount: 0,
          viewsCount: 0,
          recruiter: {
            name: 'Robert Wilson',
            email: 'robert.w@company.com'
          },
          description: 'Part-time Data Analyst to help with business intelligence and reporting.',
          requirements: ['2+ years experience', 'SQL expertise', 'Visualization tools'],
          benefits: ['Flexible hours', 'Remote options', 'Professional growth'],
          skills: ['SQL', 'Tableau', 'Excel', 'Python'],
          remote: true,
          urgent: false
        }
      ];

      const mockStats: JobStats = {
        totalJobs: mockJobs.length,
        activeJobs: mockJobs.filter(j => j.status === 'active').length,
        closedJobs: mockJobs.filter(j => j.status === 'closed').length,
        draftJobs: mockJobs.filter(j => j.status === 'draft').length,
        totalApplications: mockJobs.reduce((sum, job) => sum + job.applicationsCount, 0),
        avgApplicationsPerJob: Math.round(mockJobs.reduce((sum, job) => sum + job.applicationsCount, 0) / mockJobs.length),
        jobsByDepartment: mockJobs.reduce((acc, job) => {
          acc[job.department] = (acc[job.department] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number }),
        jobsByType: mockJobs.reduce((acc, job) => {
          acc[job.type] = (acc[job.type] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number })
      };

      setJobs(mockJobs);
      setStats(mockStats);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    return matchesSearch && matchesDepartment && matchesStatus && matchesType;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: keyof Job) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === sortedJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(sortedJobs.map(job => job.id));
    }
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      setJobs(prev => prev.filter(job => job.id !== jobToDelete));
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-100 text-blue-800';
      case 'part-time':
        return 'bg-purple-100 text-purple-800';
      case 'contract':
        return 'bg-orange-100 text-orange-800';
      case 'internship':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (salary: Job['salary']) => {
    if (salary.min >= 1000) {
      return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
    }
    return `$${salary.min} - $${salary.max}/hr`;
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'entry':
        return 'bg-green-100 text-green-800';
      case 'mid':
        return 'bg-blue-100 text-blue-800';
      case 'senior':
        return 'bg-purple-100 text-purple-800';
      case 'executive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Management</h1>
        <p className="text-gray-600">Manage job postings, applications, and recruitment analytics</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeJobs}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalApplications}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Applications</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgApplicationsPerJob}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Analytics">Analytics</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Post New Job
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedJobs.length === sortedJobs.length && sortedJobs.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1">
                    Job Title
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('postedDate')}
                >
                  <div className="flex items-center gap-1">
                    Posted
                    {sortField === 'postedDate' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(job.id)}
                      onChange={() => handleSelectJob(job.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {job.title}
                          {job.urgent && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Urgent</span>
                          )}
                          {job.remote && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Remote</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{job.recruiter.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {job.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(job.type)}`}>
                      {job.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatSalary(job.salary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(job.postedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>{job.applicationsCount}</span>
                      <span className="text-gray-500">({job.viewsCount} views)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewJob(job)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedJob.status)}`}>
                      {selectedJob.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedJob.type)}`}>
                      {selectedJob.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(selectedJob.experience)}`}>
                      {selectedJob.experience}
                    </span>
                    {selectedJob.remote && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Remote
                      </span>
                    )}
                    {selectedJob.urgent && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Urgent
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{selectedJob.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatSalary(selectedJob.salary)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Closes {new Date(selectedJob.closingDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
                    <p className="text-gray-600">{selectedJob.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Benefits</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {selectedJob.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Job Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Applications</span>
                        <span className="font-medium">{selectedJob.applicationsCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Views</span>
                        <span className="font-medium">{selectedJob.viewsCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Conversion Rate</span>
                        <span className="font-medium">
                          {selectedJob.viewsCount > 0 
                            ? `${((selectedJob.applicationsCount / selectedJob.viewsCount) * 100).toFixed(1)}%`
                            : '0%'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Recruiter</h3>
                    <div className="space-y-2 text-sm">
                      <div className="text-gray-900 font-medium">{selectedJob.recruiter.name}</div>
                      <div className="text-gray-600">{selectedJob.recruiter.email}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Posted</span>
                        <span className="font-medium">{new Date(selectedJob.postedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Closing</span>
                        <span className="font-medium">{new Date(selectedJob.closingDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Job
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  View Applications
                </button>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Job</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this job posting? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Job
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
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

export default AdminJobsPage;
