import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Briefcase, MapPin, Clock, DollarSign, Calendar, Building, Users, Star, Heart, Eye, ChevronDown, ChevronUp, X, Plus } from 'lucide-react';
import { selectUser } from '../../store/slices/authSlice';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  department: string;
  type: string;
  experience: string;
  salary: {
    currency: string;
    min: number;
    max: number;
  };
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  postedAt: string;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  remote: boolean;
  hybrid: boolean;
  featured: boolean;
  applicants: number;
  views: number;
  matchScore?: number;
  saved: boolean;
  applied: boolean;
}

interface JobFilters {
  search: string;
  location: string;
  type: string;
  experience: string;
  department: string;
  salaryMin: number;
  salaryMax: number;
  remote: boolean;
  hybrid: boolean;
  postedWithin: string;
}

const BrowseJobsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [expandedJobs, setExpandedJobs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    location: '',
    type: '',
    experience: '',
    department: '',
    salaryMin: 0,
    salaryMax: 500000,
    remote: false,
    hybrid: false,
    postedWithin: '',
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Solutions',
        location: 'San Francisco, CA',
        department: 'Engineering',
        type: 'full-time',
        experience: '5-7 years',
        salary: {
          currency: 'USD',
          min: 120000,
          max: 180000,
        },
        description: 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for developing and maintaining our web applications using modern JavaScript frameworks.',
        requirements: [
          '5+ years of experience with React and TypeScript',
          'Strong understanding of modern JavaScript (ES6+)',
          'Experience with state management libraries (Redux, MobX)',
          'Knowledge of responsive design and CSS frameworks',
          'Experience with testing frameworks (Jest, React Testing Library)',
        ],
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Redux', 'Jest'],
        benefits: [
          'Competitive salary and equity',
          'Comprehensive health insurance',
          'Flexible work hours',
          'Remote work options',
          'Professional development budget',
        ],
        postedAt: '2024-01-20T10:00:00Z',
        deadline: '2024-02-20T23:59:59Z',
        status: 'active',
        remote: true,
        hybrid: true,
        featured: true,
        applicants: 45,
        views: 1250,
        matchScore: 92,
        saved: false,
        applied: false,
      },
      {
        id: '2',
        title: 'Full Stack Developer',
        company: 'Digital Innovations',
        location: 'New York, NY',
        department: 'Engineering',
        type: 'full-time',
        experience: '3-5 years',
        salary: {
          currency: 'USD',
          min: 100000,
          max: 150000,
        },
        description: 'Join our team as a Full Stack Developer and work on cutting-edge projects. You will be involved in both frontend and backend development using modern technologies.',
        requirements: [
          '3+ years of full-stack development experience',
          'Proficiency in React and Node.js',
          'Experience with databases (PostgreSQL, MongoDB)',
          'Knowledge of cloud platforms (AWS, Azure)',
          'Understanding of DevOps practices',
        ],
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
        benefits: [
          'Health, dental, and vision insurance',
          '401(k) with company match',
          'Unlimited PTO',
          'Gym membership',
          'Free lunch and snacks',
        ],
        postedAt: '2024-01-18T14:30:00Z',
        deadline: '2024-02-15T23:59:59Z',
        status: 'active',
        remote: true,
        hybrid: false,
        featured: false,
        applicants: 32,
        views: 890,
        matchScore: 78,
        saved: false,
        applied: false,
      },
      {
        id: '3',
        title: 'React Developer',
        company: 'StartupXYZ',
        location: 'Austin, TX',
        department: 'Engineering',
        type: 'contract',
        experience: '2-4 years',
        salary: {
          currency: 'USD',
          min: 80,
          max: 120,
        },
        description: 'We are seeking a talented React Developer to join our fast-paced startup environment. You will work on innovative products and have the opportunity to make a significant impact.',
        requirements: [
          '2+ years of React development experience',
          'Strong JavaScript and ES6+ knowledge',
          'Experience with modern CSS and responsive design',
          'Familiarity with RESTful APIs',
          'Ability to work in an agile environment',
        ],
        skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Git', 'Agile'],
        benefits: [
          'Flexible work schedule',
          'Remote work options',
          'Stock options',
          'Professional development opportunities',
          'Casual work environment',
        ],
        postedAt: '2024-01-16T09:15:00Z',
        deadline: '2024-02-10T23:59:59Z',
        status: 'active',
        remote: false,
        hybrid: true,
        featured: false,
        applicants: 28,
        views: 650,
        matchScore: 65,
        saved: false,
        applied: false,
      },
      {
        id: '4',
        title: 'Frontend Engineer',
        company: 'Enterprise Systems',
        location: 'Boston, MA',
        department: 'Engineering',
        type: 'full-time',
        experience: '4-6 years',
        salary: {
          currency: 'USD',
          min: 110000,
          max: 160000,
        },
        description: 'Join our enterprise team as a Frontend Engineer and work on large-scale applications. You will collaborate with cross-functional teams to deliver high-quality software solutions.',
        requirements: [
          '4+ years of frontend development experience',
          'Expert knowledge of React and TypeScript',
          'Experience with testing and debugging',
          'Understanding of performance optimization',
          'Knowledge of accessibility standards',
        ],
        skills: ['React', 'TypeScript', 'CSS', 'Testing', 'Performance', 'Accessibility'],
        benefits: [
          'Comprehensive benefits package',
          'Retirement savings plan',
          'Tuition reimbursement',
          'Wellness programs',
          'Career advancement opportunities',
        ],
        postedAt: '2024-01-14T11:45:00Z',
        deadline: '2024-02-25T23:59:59Z',
        status: 'active',
        remote: true,
        hybrid: true,
        featured: true,
        applicants: 67,
        views: 2100,
        matchScore: 88,
        saved: false,
        applied: false,
      },
      {
        id: '5',
        title: 'JavaScript Developer',
        company: 'WebCraft Agency',
        location: 'Los Angeles, CA',
        department: 'Engineering',
        type: 'part-time',
        experience: '1-3 years',
        salary: {
          currency: 'USD',
          min: 60000,
          max: 80000,
        },
        description: 'We are looking for a JavaScript Developer to join our creative agency. You will work on various client projects and help build amazing web experiences.',
        requirements: [
          '1+ years of JavaScript development experience',
          'Knowledge of modern JavaScript frameworks',
          'Experience with responsive web design',
          'Understanding of web performance',
          'Good communication skills',
        ],
        skills: ['JavaScript', 'React', 'Vue', 'CSS', 'HTML', 'Web Performance'],
        benefits: [
          'Flexible work hours',
          'Remote work options',
          'Creative work environment',
          'Professional development',
          'Company events',
        ],
        postedAt: '2024-01-12T16:20:00Z',
        deadline: '2024-02-05T23:59:59Z',
        status: 'active',
        remote: true,
        hybrid: false,
        featured: false,
        applicants: 19,
        views: 420,
        matchScore: 72,
        saved: false,
        applied: false,
      },
    ];

    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type);
    }

    // Apply experience filter
    if (filters.experience) {
      filtered = filtered.filter(job => job.experience === filters.experience);
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(job => job.department === filters.department);
    }

    // Apply salary filter
    filtered = filtered.filter(job => 
      job.salary.min >= filters.salaryMin && job.salary.max <= filters.salaryMax
    );

    // Apply remote/hybrid filters
    if (filters.remote) {
      filtered = filtered.filter(job => job.remote);
    }
    if (filters.hybrid) {
      filtered = filtered.filter(job => job.hybrid);
    }

    // Apply posted within filter
    if (filters.postedWithin) {
      const now = new Date();
      const daysAgo = parseInt(filters.postedWithin);
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(job => 
        new Date(job.postedAt) >= cutoffDate
      );
    }

    // Sort by match score (highest first) and then by posted date (newest first)
    filtered.sort((a, b) => {
      if (a.matchScore && b.matchScore) {
        if (a.matchScore !== b.matchScore) {
          return b.matchScore - a.matchScore;
        }
      }
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, filters]);

  const handleFilterChange = (field: keyof JobFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: '',
      experience: '',
      department: '',
      salaryMin: 0,
      salaryMax: 500000,
      remote: false,
      hybrid: false,
      postedWithin: '',
    });
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
    
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApply = (jobId: string) => {
    navigate(`/candidate/jobs/${jobId}/apply`);
  };

  const handleViewDetails = (jobId: string) => {
    navigate(`/candidate/jobs/${jobId}`);
  };

  const formatSalary = (salary: Job['salary']) => {
    if (salary.min >= 1000) {
      return `${salary.currency} ${(salary.min / 1000).toFixed(0)}k-${(salary.max / 1000).toFixed(0)}k`;
    }
    return `${salary.currency} ${salary.min}-${salary.max}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysAgo = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      case 'internship': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="text-gray-600">Find and apply for opportunities that match your skills and experience</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by title, company, skills, or keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="City, State, or Remote"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-7 years">5-7 years</option>
                  <option value="7+ years">7+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={filters.salaryMin}
                    onChange={(e) => handleFilterChange('salaryMin', parseInt(e.target.value) || 0)}
                    placeholder="Min"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.salaryMax}
                    onChange={(e) => handleFilterChange('salaryMax', parseInt(e.target.value) || 500000)}
                    placeholder="Max"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => handleFilterChange('remote', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remote</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hybrid}
                      onChange={(e) => handleFilterChange('hybrid', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Hybrid</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posted Within</label>
                <select
                  value={filters.postedWithin}
                  onChange={(e) => handleFilterChange('postedWithin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any time</option>
                  <option value="1">Last 24 hours</option>
                  <option value="3">Last 3 days</option>
                  <option value="7">Last week</option>
                  <option value="30">Last month</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                {filteredJobs.length} jobs found
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {currentJobs.length} of {filteredJobs.length} jobs
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Best Match</option>
              <option>Most Recent</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {currentJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {job.title}
                            {job.featured && (
                              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Featured
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span className="font-medium">{job.company}</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </div>
                            {job.remote && (
                              <>
                                <span>•</span>
                                <span className="text-green-600">Remote</span>
                              </>
                            )}
                            <span>•</span>
                            <span className={getTypeColor(job.type)}>
                              {job.type}
                            </span>
                            <span>•</span>
                            <span>{job.experience}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {job.matchScore && (
                            <div className="text-right">
                              <div className={`text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
                                {job.matchScore}% Match
                              </div>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    job.matchScore >= 80 ? 'bg-green-500' :
                                    job.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${job.matchScore}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            <span className="font-medium">{formatSalary(job.salary)}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Posted {getDaysAgo(job.postedAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{job.applicants} applicants</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            <span>{job.views} views</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleJobExpansion(job.id)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm"
                          >
                            {expandedJobs.includes(job.id) ? 'Less' : 'More'}
                          </button>
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              job.saved 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${job.saved ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleViewDetails(job.id)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleApply(job.id)}
                            disabled={job.applied}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              job.applied
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {job.applied ? 'Applied' : 'Apply Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedJobs.includes(job.id) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {job.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Application Deadline</h4>
                    <p className="text-sm text-gray-700">
                      {formatDate(job.deadline)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {currentJobs.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.location || filters.type || filters.experience
              ? 'Try adjusting your filters or search terms'
              : 'Check back later for new opportunities'
            }
          </p>
          {filters.search || filters.location || filters.type || filters.experience ? (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <div className="text-sm text-gray-500">
              New jobs are posted regularly. Check back soon!
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseJobsPage;
