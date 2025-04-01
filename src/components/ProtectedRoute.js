import { Navigate, useLocation } from 'react-router-dom';
import { getVar } from '../utils/externalStore';
import createLogger from '../utils/logger';

const log = createLogger('ProtectedRoute');

export const ProtectedRoute = ({ children, path }) => {
  const location = useLocation();
  const isAuthenticated = getVar(':isAuth') === "1";

  log.debug('ProtectedRoute check', {
    path,
    currentPath: location.pathname,
    isAuthenticated
  });

  if (!isAuthenticated) {
    log.debug('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};
