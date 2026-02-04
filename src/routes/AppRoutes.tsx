import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { type UserRole } from '../types';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminProfilePage from '../pages/admin/ProfilePage';
import AdminUsersPage from '../pages/admin/UsersPage';
import AdminJobsPage from '../pages/admin/JobsPage';
import AdminReportsPage from '../pages/admin/ReportsPage';
import AdminSettingsPage from '../pages/admin/SettingsPage';
import RecruiterDashboard from '../pages/recruiter/Dashboard';
import RecruiterProfilePage from '../pages/recruiter/ProfilePage';
import RecruiterCandidatesPage from '../pages/recruiter/CandidatesPage';
import RecruiterInterviewsPage from '../pages/recruiter/InterviewsPage';
import PipelinesPage from '../pages/recruiter/PipelinesPage';
import ReportsPage from '../pages/recruiter/ReportsPage';
import CandidateDashboard from '../pages/candidate/Dashboard';
import Login from '../pages/auth/Login';
import CreateJob from '../pages/recruiter/PostJobPage';
import JobList from '../pages/recruiter/JobList';
import ApplicationPipeline from '../pages/recruiter/ApplicationPipeline';
import QuestionsManager from '../pages/recruiter/QuestionsManager';
import ScheduleInterview from '../pages/recruiter/ScheduleInterviewPage';
import CandidateJobList from '../pages/candidate/BrowseJobsPage';
import ApplyJob from '../pages/candidate/ApplyJob';
import CandidateProfile from '../pages/candidate/ProfilePage';
import CandidateApplications from '../pages/candidate/ApplicationsPage';
import CandidateInterviewsPage from '../pages/candidate/InterviewsPage';

// Placeholder components for missing routes


const CandidateApplicationsPage = () => <div className="p-6"><h2 className="text-2xl font-bold">My Applications</h2><p className="text-gray-600">Track your job applications</p></div>;
const CandidateInterviewsComponent = () => <div className="p-6"><h2 className="text-2xl font-bold">My Interviews</h2><p className="text-gray-600">View upcoming and past interviews</p></div>;
const CandidateProfilePage = () => <div className="p-6"><h2 className="text-2xl font-bold">Profile Settings</h2><p className="text-gray-600">Update your profile information</p></div>;

const AppRoutes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to="/recruiter" replace />
        },
        // Admin routes
        {
          path: 'admin',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin/profile',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminProfilePage />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin/users',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminUsersPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin/jobs',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminJobsPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin/reports',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminReportsPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'admin/settings',
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminSettingsPage />
            </ProtectedRoute>
          )
        },
        // Recruiter routes
        {
          path: 'recruiter',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/jobs',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <JobList />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/create-job',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <CreateJob />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/jobs/:id/edit',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <CreateJob />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/questions',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <QuestionsManager />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/candidates',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterCandidatesPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/candidates/:id',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <div className="p-6"><h2 className="text-2xl font-bold">Candidate Review</h2><p className="text-gray-600">Review candidate details</p></div>
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/applications',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <ApplicationPipeline />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/interviews',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterInterviewsPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/pipelines',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <PipelinesPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/reports',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <ReportsPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/profile',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterProfilePage />
            </ProtectedRoute>
          )
        },
        {
          path: 'recruiter/schedule-interview',
          element: (
            <ProtectedRoute requiredRole="recruiter">
              <ScheduleInterview />
            </ProtectedRoute>
          )
        },
        // Candidate routes
        {
          path: 'candidate',
          element: (
            <ProtectedRoute requiredRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          )
        },
        {
          path: 'candidate/jobs',
          element: (
            <ProtectedRoute requiredRole="candidate">
              <CandidateJobList />
            </ProtectedRoute>
          )
        },
        {
          path: 'candidate/jobs/:id',
          element: (
            <ProtectedRoute requiredRole="candidate">
              <div className="p-6"><h2 className="text-2xl font-bold">Job Details</h2><p className="text-gray-600">View job information and apply</p></div>
            </ProtectedRoute>
          )
        },
        {
          path: 'candidate/jobs/:id/apply',
          element: (
            <ProtectedRoute requiredRole="candidate">
              <ApplyJob />
            </ProtectedRoute>
          )
        },
        {
          path: 'candidate/applications',
          element: (
            <ProtectedRoute requiredRole="candidate">
              <CandidateApplications />
            </ProtectedRoute>
          )
        },
        {
          path: 'candidate/interviews',
          element: (
            <ProtectedRoute requiredRole="candidate">
              <CandidateInterviewsPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'candidate/profile',
          element: (
            <ProtectedRoute requiredRole="candidate">
              <CandidateProfile />
            </ProtectedRoute>
          )
        },
        // Catch all route
        {
          path: '*',
          element: <div className="p-6 text-center"><h1 className="text-2xl font-bold text-gray-900">404 - Page Not Found</h1><p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p></div>
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
