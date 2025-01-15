import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventTypeContext } from '../context/EventTypeContext';
import logo from '../assets/wf-icon.png';
import useLogger from '../hooks/useLogger';
import { login } from '../api/api';
import { setVars, listVars, getVar } from '../utils/externalStore';

const Login = () => {
  const fileName = '[Login] ';
  const logAndTime = useLogger(fileName);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loadEventTypes } = useEventTypeContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    logAndTime('Login attempt started');
    console.log(`Email: ${email}`);

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      logAndTime('Sending login request...');
      const response = await login(email, password);
      logAndTime('Login response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { userID, roleID, acctID, acctName, userEmail } = response.data.user;

      logAndTime('Loading eventTypes');
      loadEventTypes();

      setVars({ ':userEmail': userEmail, ':userID': userID });
      setVars({ ':acctID': acctID, ':acctName': acctName, ':roleID': roleID });
      setVars({ ':isAuth': "1" });

      // Debug log to ensure variables are set
      console.log('Variables set:', {
        ':userEmail': getVar(':userEmail'),
        ':userID': getVar(':userID'),
        ':acctID': getVar(':acctID'),
        ':acctName': getVar(':acctName'),
        ':roleID': getVar(':roleID')
      });

      const currentVars = listVars();
      logAndTime('Current Variables:', JSON.stringify(currentVars, null, 2));

      logAndTime('User logged in successfully');

      navigate('/dashboard');
    } catch (error) {
      logAndTime(`Login failed: ${error.message}`);
      alert(`${fileName} Login failed. Please try again.`);
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
