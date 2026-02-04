import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobsAsync } from '../../store/slices/jobsSlice';
import { selectFilteredJobs } from '../../store/slices/jobsSlice';
import { type Job } from '../../types';
import { Upload, FileText, AlertCircle, CheckCircle, ArrowLeft, Send } from 'lucide-react';

const ApplyJob: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const jobs = useSelector(selectFilteredJobs);
  const job = jobs.find(j => j.id === jobId);
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (jobs.length === 0) {
      dispatch(fetchJobsAsync());
    }
  }, [dispatch, jobs.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: 'Please upload a PDF or Word document' }));
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }));
        return;
      }
      
      setResumeFile(file);
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!resumeFile) newErrors.resume = 'Resume is required';
    if (!coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !job) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate file upload with progress
      const uploadPromise = new Promise((resolve) => {
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);
        
        setTimeout(() => {
          clearInterval(interval);
          setUploadProgress(100);
          resolve(true);
        }, 2000);
      });

      await uploadPromise;
      
      // Simulate API call to submit application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to success page
      navigate('/candidate/applications', { 
        state: { 
          success: true, 
          message: `Application submitted successfully for ${job.title}` 
        } 
      });
      
    } catch (error) {
      console.error('Failed to submit application:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to submit application. Please try again.' }));
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (!job) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/candidate/jobs/${job.id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Details
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h1>
        <p className="text-gray-600">{job.department} • {job.location}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.department}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Type:</span> {job.type}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Experience:</span> {job.experience}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Location:</span> {job.location}
                </div>
                {job.salary && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Salary:</span> {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Application Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume * (PDF or Word document, max 5MB)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX up to 5MB
                    </span>
                  </label>
                </div>
                
                {errors.resume && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.resume}
                  </div>
                )}
                
                {resumeFile && (
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Resume uploaded successfully
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                />
                {errors.coverLetter && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.coverLetter}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              {/* Upload Progress */}
              {isSubmitting && uploadProgress > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Uploading resume...</span>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
