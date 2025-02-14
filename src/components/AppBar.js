import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Container from '../pages/Container'; // Import Container
import { getVar } from '../utils/externalStore'; // Import getVar from externalStore
import { Box, CircularProgress } from '@mui/material';
import { useGlobalContext } from '../context/GlobalContext'; // Import useGlobalContext

const AppBar = () => {
  const { pageConfigs } = useGlobalContext(); // Get pageConfigs from GlobalContext
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
              key={config.pageID}
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

export default AppBar;
