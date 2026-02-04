import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, User, CheckCircle, AlertCircle, X, Calendar, Briefcase, Users } from 'lucide-react';
import { selectUser } from '../store/slices/authSlice';
import { logoutAsync } from '../store/slices/authSlice';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Header: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logoutAsync() as any);
  };

  // Mock notifications - in real app, this would come from API
  useEffect(() => {
    // Generate role-specific notifications
    const generateNotifications = () => {
      const baseNotifications: Notification[] = [];
      
      if (user?.role === 'recruiter') {
        baseNotifications.push(
          {
            id: '1',
            type: 'info',
            title: 'New Application',
            message: 'John Doe applied for Senior Frontend Developer position',
            timestamp: '2024-02-02T10:30:00Z',
            read: false,
            action: {
              label: 'View Application',
              onClick: () => navigate('/recruiter/candidates'),
            },
          },
          {
            id: '2',
            type: 'success',
            title: 'Interview Scheduled',
            message: 'Interview with Jane Smith scheduled for tomorrow at 2:00 PM',
            timestamp: '2024-02-02T09:15:00Z',
            read: false,
            action: {
              label: 'View Details',
              onClick: () => navigate('/recruiter/interviews'),
            },
          },
          {
            id: '3',
            type: 'warning',
            title: 'Job Expiring Soon',
            message: 'Senior React Developer job posting will expire in 3 days',
            timestamp: '2024-02-01T14:20:00Z',
            read: true,
            action: {
              label: 'Extend Posting',
              onClick: () => navigate('/recruiter/jobs'),
            },
          }
        );
      } else if (user?.role === 'candidate') {
        baseNotifications.push(
          {
            id: '1',
            type: 'info',
            title: 'Application Status Update',
            message: 'Your application for Frontend Developer has been viewed',
            timestamp: '2024-02-02T10:30:00Z',
            read: false,
            action: {
              label: 'View Application',
              onClick: () => navigate('/candidate/applications'),
            },
          },
          {
            id: '2',
            type: 'success',
            title: 'Interview Scheduled',
            message: 'Interview scheduled for tomorrow at 2:00 PM',
            timestamp: '2024-02-02T09:15:00Z',
            read: false,
            action: {
              label: 'View Details',
              onClick: () => navigate('/candidate/interviews'),
            },
          }
        );
      } else if (user?.role === 'admin') {
        baseNotifications.push(
          {
            id: '1',
            type: 'info',
            title: 'New User Registration',
            message: '5 new users registered today',
            timestamp: '2024-02-02T10:30:00Z',
            read: false,
            action: {
              label: 'View Users',
              onClick: () => navigate('/admin/users'),
            },
          },
          {
            id: '2',
            type: 'warning',
            title: 'System Maintenance',
            message: 'Scheduled maintenance for tomorrow at 2:00 AM',
            timestamp: '2024-02-02T09:15:00Z',
            read: false,
            action: {
              label: 'View Details',
              onClick: () => navigate('/admin/settings'),
            },
          }
        );
      }

      // Common notifications for all roles
      baseNotifications.push({
        id: '99',
        type: 'info',
        title: 'Profile Update',
        message: 'Your profile was successfully updated',
        timestamp: '2024-01-31T16:45:00Z',
        read: true,
      });

      return baseNotifications;
    };

    setNotifications(generateNotifications());
  }, [user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    // Navigate to appropriate page based on user role
    if (user?.role === 'recruiter') {
      navigate('/recruiter/candidates');
    } else if (user?.role === 'candidate') {
      navigate('/candidate/applications');
    } else if (user?.role === 'admin') {
      navigate('/admin/reports');
    }
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, candidates, interviews..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark all as read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            markAsRead(notification.id);
                            if (notification.action) {
                              notification.action.onClick();
                            }
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                                  {notification.title}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                                {notification.action && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      notification.action!.onClick();
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    {notification.action.label}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200">
                    <button 
                      onClick={handleViewAllNotifications}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
