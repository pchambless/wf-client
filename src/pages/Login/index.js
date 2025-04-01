import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPresenter } from './Presenter';
import { LoginView } from './View';
import createLogger from '../../utils/logger';

const Login = () => {
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const initAttempted = useRef(false);
  const log = createLogger('Login');
  
  const presenter = useMemo(() => new LoginPresenter(), []);

  useEffect(() => {
    if (initAttempted.current) return;
    initAttempted.current = true;

    const init = async () => {
      try {
        await presenter.initEventTypes();
      } catch (error) {
        setInitError(true);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [presenter]);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      setLoginError('');

      const success = await presenter.handleLogin(email, password);
      if (success) {
        log.debug('Login successful, navigating to welcome page');
        navigate('/welcome', { replace: true });
      }
    } catch (error) {
      log.error('Login failed:', error);
      setLoginError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginView
      loading={loading}
      initError={initError}
      loginError={loginError}
      onLogin={handleLogin}
    />
  );
};

export default Login;
