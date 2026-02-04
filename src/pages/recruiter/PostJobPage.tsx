import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus, Trash2, Briefcase, MapPin, DollarSign, Clock, Users, Building, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { selectUser } from '../../store/slices/authSlice';

interface JobPost {
  title: string;
  company: string;
  location: string;
  department: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  salary: {
    currency: string;
    min: number;
    max: number;
    type: 'yearly' | 'hourly';
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  remote: boolean;
  hybrid: boolean;
  deadline: string;
  status: 'draft' | 'published' | 'closed';
  featured: boolean;
  urgent: boolean;
}

const PostJobPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  
  const [jobPost, setJobPost] = useState<JobPost>({
    title: '',
    company: user?.name || 'Company Name',
    location: '',
    department: '',
    type: 'full-time',
    experience: '',
    salary: {
      currency: 'USD',
      min: 0,
      max: 0,
      type: 'yearly',
    },
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    skills: [''],
    remote: false,
    hybrid: false,
    deadline: '',
    status: 'draft',
    featured: false,
    urgent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'requirements' | 'benefits'>('basic');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!jobPost.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!jobPost.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!jobPost.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!jobPost.department.trim()) {
      newErrors.department = 'Department is required';
    }
    if (!jobPost.experience.trim()) {
      newErrors.experience = 'Experience level is required';
    }
    if (jobPost.salary.min <= 0) {
      newErrors.salaryMin = 'Minimum salary must be greater than 0';
    }
    if (jobPost.salary.max <= 0) {
      newErrors.salaryMax = 'Maximum salary must be greater than 0';
    }
    if (jobPost.salary.max < jobPost.salary.min) {
      newErrors.salaryMax = 'Maximum salary must be greater than minimum salary';
    }
    if (!jobPost.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    if (!jobPost.deadline) {
      newErrors.deadline = 'Application deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish: boolean = false) => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const jobData = {
        ...jobPost,
        status: publish ? 'published' : 'draft',
        postedAt: new Date().toISOString(),
        postedBy: user?.name,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Job posted:', jobData);
      setSubmitStatus('success');
      
      // Navigate to jobs list after successful submission
      setTimeout(() => {
        navigate('/recruiter/jobs');
      }, 2000);
    } catch (error) {
      console.error('Error posting job:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    handleSubmit(false);
  };

  const handlePublish = () => {
    handleSubmit(true);
  };

  const addListItem = (field: 'requirements' | 'responsibilities' | 'benefits' | 'skills') => {
    setJobPost(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeListItem = (field: 'requirements' | 'responsibilities' | 'benefits' | 'skills', index: number) => {
    setJobPost(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateListItem = (field: 'requirements' | 'responsibilities' | 'benefits' | 'skills', index: number, value: string) => {
    setJobPost(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const TabButton: React.FC<{ tab: typeof activeTab; label: string; icon: React.ReactNode }> = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Post New Job</h1>
        <p className="text-gray-600">Create a new job posting to attract qualified candidates</p>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>Job {jobPost.status === 'published' ? 'published' : 'saved as draft'} successfully!</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>Error posting job. Please try again.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          <TabButton tab="basic" label="Basic Info" icon={<Briefcase className="w-4 h-4" />} />
          <TabButton tab="details" label="Job Details" icon={<FileText className="w-4 h-4" />} />
          <TabButton tab="requirements" label="Requirements" icon={<Users className="w-4 h-4" />} />
          <TabButton tab="benefits" label="Benefits" icon={<DollarSign className="w-4 h-4" />} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={jobPost.title}
                  onChange={(e) => setJobPost(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. Senior Frontend Developer"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                <input
                  type="text"
                  value={jobPost.company}
                  onChange={(e) => setJobPost(prev => ({ ...prev, company: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. TechCorp Solutions"
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={jobPost.location}
                  onChange={(e) => setJobPost(prev => ({ ...prev, location: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g. San Francisco, CA"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  value={jobPost.department}
                  onChange={(e) => setJobPost(prev => ({ ...prev, department: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={jobPost.type}
                  onChange={(e) => setJobPost(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                <select
                  value={jobPost.experience}
                  onChange={(e) => setJobPost(prev => ({ ...prev, experience: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Experience Level</option>
                  <option value="Entry Level">Entry Level (0-2 years)</option>
                  <option value="Mid Level">Mid Level (2-5 years)</option>
                  <option value="Senior Level">Senior Level (5-10 years)</option>
                  <option value="Executive Level">Executive Level (10+ years)</option>
                </select>
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Work Mode</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={jobPost.remote}
                    onChange={(e) => setJobPost(prev => ({ ...prev, remote: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Remote</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={jobPost.hybrid}
                    onChange={(e) => setJobPost(prev => ({ ...prev, hybrid: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Hybrid</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline *</label>
              <input
                type="date"
                value={jobPost.deadline}
                onChange={(e) => setJobPost(prev => ({ ...prev, deadline: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.deadline ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
            </div>
          </div>
        )}

        {/* Job Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
              <textarea
                value={jobPost.description}
                onChange={(e) => setJobPost(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide a detailed description of the role, responsibilities, and what you're looking for..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={jobPost.salary.currency}
                  onChange={(e) => setJobPost(prev => ({
                    ...prev,
                    salary: { ...prev.salary, currency: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Type</label>
                <select
                  value={jobPost.salary.type}
                  onChange={(e) => setJobPost(prev => ({
                    ...prev,
                    salary: { ...prev.salary, type: e.target.value as 'yearly' | 'hourly' }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="yearly">Yearly</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={jobPost.salary.min}
                    onChange={(e) => setJobPost(prev => ({
                      ...prev,
                      salary: { ...prev.salary, min: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="Min"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.salaryMin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <input
                    type="number"
                    value={jobPost.salary.max}
                    onChange={(e) => setJobPost(prev => ({
                      ...prev,
                      salary: { ...prev.salary, max: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="Max"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.salaryMax ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {(errors.salaryMin || errors.salaryMax) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.salaryMin || errors.salaryMax}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Job Options</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={jobPost.featured}
                    onChange={(e) => setJobPost(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Featured Job</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={jobPost.urgent}
                    onChange={(e) => setJobPost(prev => ({ ...prev, urgent: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Urgent Hiring</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Tab */}
        {activeTab === 'requirements' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements & Responsibilities</h2>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                <button
                  onClick={() => addListItem('responsibilities')}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-2">
                {jobPost.responsibilities.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListItem('responsibilities', index, e.target.value)}
                      placeholder="Enter responsibility..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {jobPost.responsibilities.length > 1 && (
                      <button
                        onClick={() => removeListItem('responsibilities', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Requirements</label>
                <button
                  onClick={() => addListItem('requirements')}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-2">
                {jobPost.requirements.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListItem('requirements', index, e.target.value)}
                      placeholder="Enter requirement..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {jobPost.requirements.length > 1 && (
                      <button
                        onClick={() => removeListItem('requirements', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                <button
                  onClick={() => addListItem('skills')}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-2">
                {jobPost.skills.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListItem('skills', index, e.target.value)}
                      placeholder="Enter skill..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {jobPost.skills.length > 1 && (
                      <button
                        onClick={() => removeListItem('skills', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === 'benefits' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Benefits</label>
                <button
                  onClick={() => addListItem('benefits')}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-2">
                {jobPost.benefits.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListItem('benefits', index, e.target.value)}
                      placeholder="Enter benefit..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {jobPost.benefits.length > 1 && (
                      <button
                        onClick={() => removeListItem('benefits', index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate('/recruiter/jobs')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Job'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
