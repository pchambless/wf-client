import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm'; // Import ProductForm
import { useUserContext } from '../context/UserContext';
import logo from '../assets/wf-icon.png';
import useLogger from '../hooks/useLogger';
import { login, fetchEventTypes, execEventType } from '../api/api'; // Ensure correct import path
import buildRequestBody from '../api/requestBuilder';

const Login = () => {
  const fileName = '[Login] ';
  const log = useLogger(fileName);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserEmail, setEventTypes, setAccounts } = useUserContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    log('Login attempt started');
    log(`Email: ${email}`);
    log(`Password: ${password}`);

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await login(email, password);  // Removed message and userId

      setUserEmail(email);
      log('User logged in successfully');

      // Fetch event types
      log('Fetching event types');
      const eventTypesData = await fetchEventTypes();
      setEventTypes(eventTypesData);
      localStorage.setItem('eventTypes', JSON.stringify(eventTypesData));
      log('Event types set successfully');

      // Fetch user accounts
      log(`Fetching user accounts for email: ${email}`);
      const clientParams = { userEmail: email };
      const requestBody = await buildRequestBody('userAccts', clientParams, log);
      const accountsData = await execEventType(requestBody.eventType, requestBody.params);
      setAccounts(accountsData);
      log('User accounts set successfully');

      log('Navigating to /main');
      navigate('/main');
    } catch (error) {
      log(`Login failed: ${error.message}`);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-product-bg">
      <div className="flex items-center mb-6">
        <img src={logo} alt="Whatsfresh Logo" className="w-8 h-8 mr-2" />
        <h2 className="text-3xl font-bold text-gray-800">Whatsfresh Today?</h2>
      </div>
      <ProductForm onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Login
        </button>
      </ProductForm>
    </div>
  );
};

export default Login;
