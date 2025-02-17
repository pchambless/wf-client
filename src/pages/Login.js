import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { useEventTypeContext } from '../context/EventTypeContext';
import logo from '../assets/wf-icon.png';
import useLogger from '../hooks/useLogger';
import { login, fetchEventList, fetchPageConfigs } from '../api/api';
import { setVars } from '../utils/externalStore';


const Login = () => {
  const log = useLogger('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setEventTypes, setPageConfigs, setUserAcctList, setAccount } = useGlobalContext();
  const { execEvent } = useEventTypeContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    log('Login attempt started');
    log(`Email: ${email}`);

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      log('Sending login request...');
      const response = await login(email, password);

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { userID, roleID, acctID, userEmail } = response.data.user;

      log('loadiing EventTypes');
      await fetchEventList(setEventTypes);
      log('Loaded EventTypes');

      log('Loading pageConfigs');
      await fetchPageConfigs(setPageConfigs);
      log('Loaded pageConfigs');

      setVars({ ':userID': userID, ':roleID': roleID, ':userEmail': userEmail });
      setVars({ ':acctID': acctID, ':isAuth': "1" });

      setAccount(acctID); // Set the selectedAccount state

      log('Fetching userAcctList');
      const userAcctList = await execEvent('userAcctList');
      await setUserAcctList(userAcctList);

      log('User logged in successfully');
      log('Navigating to /welcome');
      navigate('/welcome');
    } catch (error) {
      log(`Login failed: ${error.message}`);
      alert(`Login failed. Please try again.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-product-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-100 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <img src={logo} alt="Whatsfresh Logo" className="w-12 h-12 mr-2" />
          <h2 className="text-3xl font-bold text-gray-800">Whatsfresh Today?</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
