import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobsAsync, setFilters, clearFilters } from '../../store/slices/jobsSlice';
import { selectFilteredJobs, selectJobsLoading, selectJobsFilters } from '../../store/slices/jobsSlice';
import { type Job } from '../../types';
import { Briefcase, MapPin, Clock, Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const jobs = useSelector(selectFilteredJobs);
  const isLoading = useSelector(selectJobsLoading);
  const filters = useSelector(selectJobsFilters);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchJobsAsync());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ ...filters, search: searchTerm }));
  };

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ ...filters, [key]: value }));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  const handleApply = (jobId: string) => {
    // Handle job application
    navigate(`/candidate/jobs/${jobId}/apply`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, skills, or company..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Austin">Austin</option>
                <option value="London">London</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-sm text-gray-600">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
            </div>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company || job.department}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-2">
              {job.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="w-4 h-4 mr-2" />
                {job.type} • {job.experience}
              </div>
              {job.salary && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">
                    {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {job.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Posted {new Date(job.postedAt).toLocaleDateString()}
              </div>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(job.type)}`}>
                {job.type}
              </span>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => handleApply(job.id)}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default JobList;
