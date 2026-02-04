import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Save, Edit2, X, Plus, Trash2, Check, Building, Users, Target } from 'lucide-react';
import { selectUser, selectAuthLoading } from '../../store/slices/authSlice';

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    department: string;
    position: string;
  };
  professionalInfo: {
    experience: number;
    specialization: string[];
    skills: string[];
    certifications: string[];
    languages: Array<{ language: string; proficiency: string }>;
    achievements: string[];
  };
  companyInfo: {
    companyName: string;
    department: string;
    location: string;
    teamSize: string;
    reportingTo: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    calendarSync: boolean;
    timezone: string;
    language: string;
  };
}

const RecruiterProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'company' | 'preferences'>('personal');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      firstName: user?.name?.split(' ')[0] || 'John',
      lastName: user?.name?.split(' ')[1] || 'Doe',
      email: user?.email || 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      bio: 'Experienced recruiter with a passion for connecting talented candidates with great opportunities.',
      department: 'Human Resources',
      position: 'Senior Recruiter',
    },
    professionalInfo: {
      experience: 8,
      specialization: ['Technical Recruiting', 'Executive Search', 'Campus Recruiting'],
      skills: ['Sourcing', 'Interviewing', 'Candidate Assessment', 'ATS Management', 'Relationship Building'],
      certifications: ['SHRM-CP', 'LinkedIn Recruiter', 'Certified Technical Recruiter'],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Professional' },
      ],
      achievements: [
        'Placed 50+ candidates in 2023',
        'Reduced time-to-hire by 30%',
        'Achieved 95% offer acceptance rate',
      ],
    },
    companyInfo: {
      companyName: 'TechCorp Solutions',
      department: 'Talent Acquisition',
      location: 'San Francisco, CA',
      teamSize: '12 recruiters',
      reportingTo: 'VP of Human Resources',
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      calendarSync: true,
      timezone: 'America/New_York',
      language: 'English',
    },
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newLanguage, setNewLanguage] = useState({ language: '', proficiency: 'Beginner' });

  const handleSave = async () => {
    setSaveStatus('saving');
    
    try {
      // Simulate API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveStatus('saved');
      setIsEditing(false);
      
      // Reset save status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.professionalInfo.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          skills: [...prev.professionalInfo.skills, newSkill.trim()],
        },
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        skills: prev.professionalInfo.skills.filter(skill => skill !== skillToRemove),
      },
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !profileData.professionalInfo.certifications.includes(newCertification.trim())) {
      setProfileData(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          certifications: [...prev.professionalInfo.certifications, newCertification.trim()],
        },
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        certifications: prev.professionalInfo.certifications.filter(cert => cert !== certToRemove),
      },
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim() && !profileData.professionalInfo.achievements.includes(newAchievement.trim())) {
      setProfileData(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          achievements: [...prev.professionalInfo.achievements, newAchievement.trim()],
        },
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (achievementToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        achievements: prev.professionalInfo.achievements.filter(achievement => achievement !== achievementToRemove),
      },
    }));
  };

  const addLanguage = () => {
    if (newLanguage.language.trim()) {
      setProfileData(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          languages: [...prev.professionalInfo.languages, { ...newLanguage }],
        },
      }));
      setNewLanguage({ language: '', proficiency: 'Beginner' });
    }
  };

  const removeLanguage = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        languages: prev.professionalInfo.languages.filter((_, i) => i !== index),
      },
    }));
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

  const updateNestedProfileData = (section: keyof ProfileData, subsection: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value,
        },
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
              <p className="text-gray-600">{profileData.personalInfo.position}</p>
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
            {saveStatus === 'error' && (
              <div className="flex items-center space-x-2 text-red-600">
                <X className="w-4 h-4" />
                <span className="text-sm">Save failed</span>
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
                  onClick={handleCancel}
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
          <TabButton tab="company" label="Company" icon={<Building className="w-4 h-4" />} />
          <TabButton tab="preferences" label="Preferences" icon={<Calendar className="w-4 h-4" />} />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={profileData.personalInfo.department}
                  onChange={(e) => updateProfileData('personalInfo', 'department', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="Human Resources">Human Resources</option>
                  <option value="Talent Acquisition">Talent Acquisition</option>
                  <option value="Recruiting">Recruiting</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  value={profileData.personalInfo.position}
                  onChange={(e) => updateProfileData('personalInfo', 'position', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
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
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {profileData.professionalInfo.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newSkill.trim()) {
                          addSkill();
                        }
                      }}
                      placeholder="Add a skill..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {profileData.professionalInfo.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {cert}
                      {isEditing && (
                        <button
                          onClick={() => removeCertification(cert)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newCertification.trim()) {
                          addCertification();
                        }
                      }}
                      placeholder="Add a certification..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addCertification}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
              <div className="space-y-3">
                {profileData.professionalInfo.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{achievement}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeAchievement(achievement)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Add an achievement..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addAchievement}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Company Information Tab */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={profileData.companyInfo.companyName}
                  onChange={(e) => updateProfileData('companyInfo', 'companyName', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={profileData.companyInfo.department}
                  onChange={(e) => updateProfileData('companyInfo', 'department', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profileData.companyInfo.location}
                  onChange={(e) => updateProfileData('companyInfo', 'location', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                <input
                  type="text"
                  value={profileData.companyInfo.teamSize}
                  onChange={(e) => updateProfileData('companyInfo', 'teamSize', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reporting To</label>
                <input
                  type="text"
                  value={profileData.companyInfo.reportingTo}
                  onChange={(e) => updateProfileData('companyInfo', 'reportingTo', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profileData.preferences.emailNotifications}
                  onChange={(e) => updateProfileData('preferences', 'emailNotifications', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Email Notifications</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profileData.preferences.smsNotifications}
                  onChange={(e) => updateProfileData('preferences', 'smsNotifications', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">SMS Notifications</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profileData.preferences.calendarSync}
                  onChange={(e) => updateProfileData('preferences', 'calendarSync', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Calendar Sync</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={profileData.preferences.timezone}
                  onChange={(e) => updateProfileData('preferences', 'timezone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={profileData.preferences.language}
                  onChange={(e) => updateProfileData('preferences', 'language', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate('/recruiter')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfilePage;
