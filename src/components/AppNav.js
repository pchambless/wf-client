import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Container from './Container';
import { useEventTypeContext } from '../context/EventTypeContext'; // Adjusted import path
import { getVar } from '../utils/externalStore'; // Import getVar from externalStore
import { Box, CircularProgress } from '@mui/material';

const AppNav = () => {
  const { pageConfigs } = useEventTypeContext();
  const isAuthenticated = getVar(':isAuth') === '1'; // Check authentication status using getVar

  const renderLayout = (pageConfig) => {
    const Component = lazy(() => import(`../${pageConfig.appLayout}`));
    return <Component pageConfig={pageConfig} />;
  };

  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/" element={<Container />}>
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>}>
                {renderLayout({ appLayout: 'pages/Dashboard' })}
              </Suspense>
            }
          />
          {pageConfigs.map((config) => (
            <Route
              key={config.pageName}
              path={`${config.pageName}`}
              element={
                <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>}>
                  {renderLayout(config)}
                </Suspense>
              }
            />
          ))}
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default AppNav;
