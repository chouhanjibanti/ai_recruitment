import React, { useState, useEffect } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Lock,
  Users,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Monitor,
  Wifi,
  HardDrive,
  Cpu,
  Activity,
  Clock,
  Calendar,
  FileText,
  Trash2,
  Plus,
  Edit,
  X
} from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    adminEmail: string;
    timezone: string;
    dateFormat: string;
    language: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    newUserRegistration: boolean;
    jobApplications: boolean;
    systemAlerts: boolean;
  };
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSymbols: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    twoFactorAuth: boolean;
    ipWhitelist: string[];
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    retentionPeriod: number;
    lastBackup: string;
    nextBackup: string;
    backupLocation: string;
  };
  integration: {
    emailProvider: string;
    smtpServer: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    analyticsEnabled: boolean;
    googleAnalyticsId: string;
  };
}

interface SystemStatus {
  uptime: string;
  serverLoad: number;
  memoryUsage: number;
  diskUsage: number;
  databaseStatus: 'healthy' | 'warning' | 'error';
  lastBackup: string;
  activeUsers: number;
  apiCalls: number;
  errorRate: number;
}

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockSettings: SystemSettings = {
        general: {
          siteName: 'AI Recruitment Platform',
          siteDescription: 'Advanced AI-powered recruitment management system',
          adminEmail: 'admin@company.com',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          language: 'English'
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          newUserRegistration: true,
          jobApplications: true,
          systemAlerts: true
        },
        security: {
          passwordMinLength: 8,
          passwordRequireUppercase: true,
          passwordRequireNumbers: true,
          passwordRequireSymbols: true,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          twoFactorAuth: true,
          ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8']
        },
        backup: {
          autoBackup: true,
          backupFrequency: 'daily',
          retentionPeriod: 30,
          lastBackup: '2024-02-02T02:00:00Z',
          nextBackup: '2024-02-03T02:00:00Z',
          backupLocation: 'cloud-storage'
        },
        integration: {
          emailProvider: 'smtp',
          smtpServer: 'smtp.company.com',
          smtpPort: 587,
          smtpUsername: 'noreply@company.com',
          smtpPassword: '••••••••',
          analyticsEnabled: true,
          googleAnalyticsId: 'GA-XXXXXXXXX'
        }
      };

      const mockSystemStatus: SystemStatus = {
        uptime: '15 days, 8 hours',
        serverLoad: 45,
        memoryUsage: 67,
        diskUsage: 78,
        databaseStatus: 'healthy',
        lastBackup: '2024-02-02T02:00:00Z',
        activeUsers: 127,
        apiCalls: 45678,
        errorRate: 0.2
      };

      setSettings(mockSettings);
      setSystemStatus(mockSystemStatus);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
  };

  const handleTestEmail = async () => {
    if (!testEmail) return;
    
    // Simulate email test
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Test email sent to ${testEmail}`);
  };

  const handleBackupNow = async () => {
    // Simulate backup
    await new Promise(resolve => setTimeout(resolve, 3000));
    alert('Backup completed successfully');
  };

  const handleSettingChange = (category: keyof SystemSettings, field: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings || !systemStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Settings not available</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Uptime</p>
              <p className="text-2xl font-bold text-green-600">{systemStatus.uptime}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Server Load</p>
              <p className="text-2xl font-bold text-blue-600">{systemStatus.serverLoad}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-purple-600">{systemStatus.activeUsers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Database Status</p>
              <p className="text-2xl font-bold text-green-600">Healthy</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Database className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <nav className="p-4">
              <div className="space-y-1">
                {[
                  { id: 'general', label: 'General', icon: Settings },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'backup', label: 'Backup', icon: Database },
                  { id: 'integration', label: 'Integration', icon: Globe }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
                </h2>
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Site Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                        <input
                          type="text"
                          value={settings.general.siteName}
                          onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                        <input
                          type="email"
                          value={settings.general.adminEmail}
                          onChange={(e) => handleSettingChange('general', 'adminEmail', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select
                          value={settings.general.timezone}
                          onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          value={settings.general.language}
                          onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b">
                        <div>
                          <p className="font-medium text-gray-900">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-600">
                            {key === 'emailNotifications' && 'Enable email notifications for system events'}
                            {key === 'pushNotifications' && 'Enable browser push notifications'}
                            {key === 'smsNotifications' && 'Enable SMS notifications for critical alerts'}
                            {key === 'newUserRegistration' && 'Notify when new users register'}
                            {key === 'jobApplications' && 'Notify about new job applications'}
                            {key === 'systemAlerts' && 'Notify about system alerts and maintenance'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Test Email Configuration</h4>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        placeholder="Enter test email address"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleTestEmail}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Send Test
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Password Requirements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
                        <input
                          type="number"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      {[
                        { key: 'passwordRequireUppercase', label: 'Require Uppercase Letters' },
                        { key: 'passwordRequireNumbers', label: 'Require Numbers' },
                        { key: 'passwordRequireSymbols', label: 'Require Special Characters' },
                        { key: 'twoFactorAuth', label: 'Enable Two-Factor Authentication' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.security[item.key as keyof Omit<typeof settings.security, 'ipWhitelist'>] as boolean}
                              onChange={(e) => handleSettingChange('security', item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">IP Whitelist</h4>
                    <div className="space-y-2">
                      {settings.security.ipWhitelist.map((ip, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={ip}
                            onChange={(e) => {
                              const newWhitelist = [...settings.security.ipWhitelist];
                              newWhitelist[index] = e.target.value;
                              handleSettingChange('security', 'ipWhitelist', newWhitelist);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => {
                              const newWhitelist = settings.security.ipWhitelist.filter((_, i) => i !== index);
                              handleSettingChange('security', 'ipWhitelist', newWhitelist);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          handleSettingChange('security', 'ipWhitelist', [...settings.security.ipWhitelist, '']);
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                        Add IP Range
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                      <select
                        value={settings.backup.backupFrequency}
                        onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
                      <input
                        type="number"
                        value={settings.backup.retentionPeriod}
                        onChange={(e) => handleSettingChange('backup', 'retentionPeriod', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Automatic Backup</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.backup.autoBackup}
                          onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Last Backup</h4>
                      <p className="text-sm text-gray-600">{new Date(settings.backup.lastBackup).toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Next Backup</h4>
                      <p className="text-sm text-gray-600">{new Date(settings.backup.nextBackup).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBackupNow}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Backup Now
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Download Backup
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'integration' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Integration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
                      <input
                        type="text"
                        value={settings.integration.smtpServer}
                        onChange={(e) => handleSettingChange('integration', 'smtpServer', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                      <input
                        type="number"
                        value={settings.integration.smtpPort}
                        onChange={(e) => handleSettingChange('integration', 'smtpPort', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                      <input
                        type="text"
                        value={settings.integration.smtpUsername}
                        onChange={(e) => handleSettingChange('integration', 'smtpUsername', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                      <input
                        type="password"
                        value={settings.integration.smtpPassword}
                        onChange={(e) => handleSettingChange('integration', 'smtpPassword', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Analytics Integration</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Enable Google Analytics</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.integration.analyticsEnabled}
                            onChange={(e) => handleSettingChange('integration', 'analyticsEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      {settings.integration.analyticsEnabled && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                          <input
                            type="text"
                            value={settings.integration.googleAnalyticsId}
                            onChange={(e) => handleSettingChange('integration', 'googleAnalyticsId', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
