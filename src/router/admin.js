import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminHome from '../admin/AdminHome';
import IssueImporter from '../admin/IssueImporter';
import GitHubDownloader from '../admin/GitHubDownloader';

// Admin routes configuration
export const adminRoutes = [
  {
    path: '/admin',
    element: <AdminHome />
  },
  {
    path: '/admin/issues',
    element: <IssueImporter />
  },
  {
    path: '/admin/github-downloader',
    element: <GitHubDownloader />,
    meta: {
      requiresAuth: true,
      permissions: [] // No special permissions required
    }
  }
];

const AppRoutes = () => {
  return (
    <Routes>
      {/* Other routes */}
      <Route path="/github-downloader" element={<GitHubDownloader />} />
      {/* Other routes */}
    </Routes>
  );
};

export default AppRoutes;
