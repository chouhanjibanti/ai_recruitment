import React from 'react';
import { NavLink } from 'react-router-dom';
import { type UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Settings,
  User,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  userRole?: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const getNavItems = () => {
    const commonItems = [
      { to: `/${userRole}`, label: 'Dashboard', icon: LayoutDashboard },
      { to: `/${userRole}/profile`, label: 'Profile', icon: User },
    ];

    switch (userRole) {
      case 'admin':
        return [
          ...commonItems,
          { to: '/admin/users', label: 'Users', icon: Users },
          { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
          { to: '/admin/reports', label: 'Reports', icon: FileText },
          { to: '/admin/settings', label: 'Settings', icon: Settings },
        ];
      case 'recruiter':
        return [
          ...commonItems,
          { to: '/recruiter/jobs', label: 'Jobs', icon: Briefcase },
          { to: '/recruiter/candidates', label: 'Candidates', icon: Users },
          { to: '/recruiter/interviews', label: 'Interviews', icon: Calendar },
          { to: '/recruiter/pipelines', label: 'Pipelines', icon: LayoutDashboard },
          { to: '/recruiter/reports', label: 'Reports', icon: FileText },
        ];
      case 'candidate':
        return [
          ...commonItems,
          { to: '/candidate/jobs', label: 'Jobs', icon: Briefcase },
          { to: '/candidate/applications', label: 'Applications', icon: FileText },
          { to: '/candidate/interviews', label: 'Interviews', icon: Calendar },
          { to: '/candidate/profile', label: 'Profile Settings', icon: Settings },
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Recruitment</h1>
            <p className="text-xs text-gray-500 capitalize">{userRole} Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
