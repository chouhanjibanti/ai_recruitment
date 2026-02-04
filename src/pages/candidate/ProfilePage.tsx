import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Save, Upload, Edit2, X, Plus, Trash2, Check } from 'lucide-react';
import { selectUser, selectAuthLoading } from '../../store/slices/authSlice';
import { type User as UserType } from '../../types';

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    dateOfBirth: string;
    gender: string;
  };
  professionalInfo: {
    experience: number;
    currentJobTitle: string;
    currentCompany: string;
    industry: string;
    skills: string[];
    languages: Array<{ language: string; proficiency: string }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
      field: string;
    }>;
    experienceHistory: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
  };
  preferences: {
    expectedSalary: {
      currency: string;
      min: number;
      max: number;
    };
    jobTypes: string[];
    preferredLocations: string[];
    workMode: string;
    availability: string;
    noticePeriod: string;
  };
  socialLinks: {
    linkedin: string;
    github: string;
    portfolio: string;
    website: string;
  };
}

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'preferences' | 'social'>('personal');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      bio: 'Passionate software developer with expertise in modern web technologies.',
      dateOfBirth: '1990-01-01',
      gender: 'prefer-not-to-say',
    },
    professionalInfo: {
      experience: 5,
      currentJobTitle: 'Senior Frontend Developer',
      currentCompany: 'Tech Corp',
      industry: 'Software Development',
      skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'JavaScript'],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Intermediate' },
      ],
      education: [
        {
          degree: 'Bachelor of Science',
          institution: 'University of Technology',
          year: '2015',
          field: 'Computer Science',
        },
      ],
      experienceHistory: [
        {
          company: 'Tech Corp',
          position: 'Senior Frontend Developer',
          startDate: '2020-01',
          endDate: 'Present',
          description: 'Leading frontend development for enterprise applications.',
        },
      ],
    },
    preferences: {
      expectedSalary: {
        currency: 'USD',
        min: 80000,
        max: 120000,
      },
      jobTypes: ['full-time', 'remote'],
      preferredLocations: ['New York', 'San Francisco', 'Remote'],
      workMode: 'remote',
      availability: 'immediately',
      noticePeriod: '2 weeks',
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      portfolio: 'https://johndoe.dev',
      website: 'https://johndoe.com',
    },
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState({ language: '', proficiency: 'Beginner' });

  const handleSave = async () => {
    setSaveStatus('saving');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updateProfileData = (section: keyof ProfileData, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
              </h1>
              <p className="text-gray-600">{profileData.professionalInfo.currentJobTitle}</p>
              <p className="text-sm text-gray-500">{profileData.personalInfo.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {saveStatus === 'saved' && (
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">Profile saved</span>
              </div>
            )}
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          <TabButton tab="personal" label="Personal Info" icon={<User className="w-4 h-4" />} />
          <TabButton tab="professional" label="Professional" icon={<Briefcase className="w-4 h-4" />} />
          <TabButton tab="preferences" label="Preferences" icon={<Calendar className="w-4 h-4" />} />
          <TabButton tab="social" label="Social Links" icon={<Mail className="w-4 h-4" />} />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={profileData.personalInfo.firstName}
                  onChange={(e) => updateProfileData('personalInfo', 'firstName', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={profileData.personalInfo.lastName}
                  onChange={(e) => updateProfileData('personalInfo', 'lastName', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.personalInfo.email}
                  onChange={(e) => updateProfileData('personalInfo', 'email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.personalInfo.phone}
                  onChange={(e) => updateProfileData('personalInfo', 'phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profileData.personalInfo.location}
                  onChange={(e) => updateProfileData('personalInfo', 'location', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={profileData.personalInfo.dateOfBirth}
                  onChange={(e) => updateProfileData('personalInfo', 'dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={profileData.personalInfo.gender}
                  onChange={(e) => updateProfileData('personalInfo', 'gender', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={profileData.personalInfo.bio}
                onChange={(e) => updateProfileData('personalInfo', 'bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        )}

        {/* Professional Information Tab */}
        {activeTab === 'professional' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Job Title</label>
                <input
                  type="text"
                  value={profileData.professionalInfo.currentJobTitle}
                  onChange={(e) => updateProfileData('professionalInfo', 'currentJobTitle', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Company</label>
                <input
                  type="text"
                  value={profileData.professionalInfo.currentCompany}
                  onChange={(e) => updateProfileData('professionalInfo', 'currentCompany', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={profileData.professionalInfo.industry}
                  onChange={(e) => updateProfileData('professionalInfo', 'industry', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={profileData.professionalInfo.experience}
                  onChange={(e) => updateProfileData('professionalInfo', 'experience', parseInt(e.target.value) || 0)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {profileData.professionalInfo.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => {
                          setProfileData(prev => ({
                            ...prev,
                            professionalInfo: {
                              ...prev.professionalInfo,
                              skills: prev.professionalInfo.skills.filter(s => s !== skill),
                            },
                          }));
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex space-x-2 mt-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newSkill.trim()) {
                        setProfileData(prev => ({
                          ...prev,
                          professionalInfo: {
                            ...prev.professionalInfo,
                            skills: [...prev.professionalInfo.skills, newSkill.trim()],
                          },
                        }));
                        setNewSkill('');
                      }
                    }}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      if (newSkill.trim()) {
                        setProfileData(prev => ({
                          ...prev,
                          professionalInfo: {
                            ...prev.professionalInfo,
                            skills: [...prev.professionalInfo.skills, newSkill.trim()],
                          },
                        }));
                        setNewSkill('');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Preferences</h2>
            
            {/* Expected Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Currency</label>
                  <select
                    value={profileData.preferences.expectedSalary.currency}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        expectedSalary: {
                          ...prev.preferences.expectedSalary,
                          currency: e.target.value,
                        },
                      },
                    }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                  <input
                    type="number"
                    value={profileData.preferences.expectedSalary.min}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        expectedSalary: {
                          ...prev.preferences.expectedSalary,
                          min: parseInt(e.target.value) || 0,
                        },
                      },
                    }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                  <input
                    type="number"
                    value={profileData.preferences.expectedSalary.max}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        expectedSalary: {
                          ...prev.preferences.expectedSalary,
                          max: parseInt(e.target.value) || 0,
                        },
                      },
                    }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode</label>
              <select
                value={profileData.preferences.workMode}
                onChange={(e) => updateProfileData('preferences', 'workMode', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={profileData.preferences.availability}
                onChange={(e) => updateProfileData('preferences', 'availability', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                <option value="immediately">Immediately</option>
                <option value="2-weeks">2 weeks</option>
                <option value="1-month">1 month</option>
                <option value="2-months">2 months</option>
                <option value="3-months">3 months</option>
              </select>
            </div>

            {/* Notice Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period</label>
              <input
                type="text"
                value={profileData.preferences.noticePeriod}
                onChange={(e) => updateProfileData('preferences', 'noticePeriod', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                placeholder="e.g., 2 weeks, 1 month"
              />
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={profileData.socialLinks.linkedin}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      linkedin: e.target.value,
                    },
                  }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={profileData.socialLinks.github}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      github: e.target.value,
                    },
                  }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="https://github.com/yourusername"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
                <input
                  type="url"
                  value={profileData.socialLinks.portfolio}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      portfolio: e.target.value,
                    },
                  }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="https://yourportfolio.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={profileData.socialLinks.website}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      website: e.target.value,
                    },
                  }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
