import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar userRole={user?.role} />
      <div className="flex-1 flex flex-col">
        <Header userRole={user?.role} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
