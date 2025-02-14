import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { Container as MuiContainer, Box, CircularProgress } from '@mui/material'; // Import Material-UI components
import PageHeader from '../components/page/PageHeader';
import Login from '../pages/Login';
import MenuStrip from '../components/page/MenuStrip'; // Import MenuStrip
import useLogger from '../hooks/useLogger';
import { useNavigate, Route, Routes, Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const Container = ({ children }) => {
  const log = useLogger('Container');
  const navigate = useNavigate();
  const { pageConfigs, isAuthenticated, getPageID } = useGlobalContext();

  const handleNavigate = (path, pageConfig) => {
    log(`Navigating to path: ${path} with pageConfig:`, pageConfig);
    // Fetch the specific pageConfig based on the pageID
    const config = pageConfigs.find(config => config.pageID === pageConfig.pageID);
    if (config) {
      // Navigate to the page with the specific pageConfig
      navigate(path, { state: { pageConfig: config } });
    }
  };

  const renderLayout = (pageConfig) => {
    const Component = lazy(() => import(`../../${pageConfig.appLayout}`));
    return <Component pageConfig={pageConfig} />;
  };

  const isAuth = useMemo(() => isAuthenticated === '1', [isAuthenticated]);
  const pageID = getPageID();

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  const currentPageConfig = pageConfigs.find(config => config.pageID === pageID);

  return (
    <MuiContainer maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'lightGray' }}>
      <PageHeader /> {/* Removed openModal prop */}
      <MenuStrip handleNavigate={handleNavigate} />
      <Box component="main" sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'row' }}>
        {isAuth ? (
          currentPageConfig ? (
            <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>}>
              {renderLayout(currentPageConfig)}
            </Suspense>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <CircularProgress />
            </Box>
          )
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Box>
      {/* You can add a footer here if needed */}
    </MuiContainer>
  );
};

export default Container;
