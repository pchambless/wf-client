import React, { useEffect, useState } from 'react';
import { Box, Container as MuiContainer, CircularProgress } from '@mui/material';
import useLogger from '../../hooks/useLogger';
import { useGlobalContext } from '../../context/GlobalContext';

const Container = ({ children, maxWidth = 'lg', loading: propLoading, error: propError }) => {
  const log = useLogger('Container');
  const { isLoading: globalLoading } = useGlobalContext();
  const [error, setError] = useState(propError || null);
  const [loading, setLoading] = useState(propLoading || globalLoading);

  // Component lifecycle logging
  useEffect(() => {
    log.debug('Container component mounted', { 
      maxWidth,
      hasChildren: !!children,
      initialLoading: loading
    });
    return () => log.debug('Container component unmounting');
  }, [log, maxWidth, children, loading]);

  // Handle loading state changes
  useEffect(() => {
    const newLoading = propLoading || globalLoading;
    if (newLoading !== loading) {
      log.debug('Loading state changed', {
        previous: loading,
        current: newLoading,
        source: propLoading ? 'props' : 'global'
      });
      setLoading(newLoading);
    }
  }, [propLoading, globalLoading, loading, log]);

  // Handle error state changes
  useEffect(() => {
    if (propError !== error) {
      if (propError) {
        log.warn('Error state updated', { error: propError });
      }
      setError(propError);
    }
  }, [propError, error, log]);

  // Performance monitoring for content rendering
  const renderContent = () => {
    const endTimer = log.startPerformanceTimer('contentRendering');
    try {
      if (loading) {
        log.debug('Rendering loading state');
        endTimer();
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        );
      }

      if (error) {
        log.warn('Rendering error state', { error });
        endTimer();
        return (
          <Box color="error.main" p={2}>
            {error}
          </Box>
        );
      }

      log.debug('Rendering container content');
      endTimer();
      return children;
    } catch (err) {
      log.error('Error rendering container content', {
        error: err.message,
        stack: err.stack
      });
      endTimer();
      throw err;
    }
  };

  return (
    <MuiContainer 
      maxWidth={maxWidth}
      sx={{
        mt: 2,
        mb: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {renderContent()}
    </MuiContainer>
  );
};

export default Container; 
