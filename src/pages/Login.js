import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { useUserContext } from '../context/UserContext';
import { useVariableContext } from '../context/VariableContext'; // Import VariableContext
import { useEventTypeContext } from '../context/EventTypeContext'; // Import EventTypeContext
import logo from '../assets/wf-icon.png';
import useLogger from '../hooks/useLogger';
import { login, fetchApiColumns, fetchEventTypes } from '../api/api'; // Import fetchApiColumns and fetchEventTypes

/**
 * Login component for user authentication.
 * 
 * This component renders a login form and handles the login process.
 * It manages the login state, fetches necessary data upon successful login,
 * and updates various contexts with user and application data.
 * 
 * @component
 * @returns {JSX.Element} The rendered Login component
 */
const Login = () => {
  const fileName = '[Login] ';
  const logAndTime = useLogger(fileName);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserEmail } = useUserContext();
  const { setVariables, logSetVariables } = useVariableContext();
  const { setEventTypes } = useEventTypeContext();
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);

  /**
   * Handles the login process when the form is submitted.
   * 
   * This function prevents the default form submission, validates inputs,
   * attempts to log in the user, fetches necessary data upon successful login,
   * updates various contexts, and sets up for navigation to the dashboard.
   * 
   * @async
   * @param {Event} e - The form submission event
   * @returns {Promise<void>}
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    logAndTime('Login attempt started');
    logAndTime(`Email: ${email}`);

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

      const { userId, userEmail } = response.data;

      logAndTime('Fetching event types');
      const eventTypes = await fetchEventTypes(); 
      logAndTime('Event types fetched:', eventTypes);

      setEventTypes(eventTypes);

      logAndTime('Fetching API columns');
      const apiVariables = await fetchApiColumns();

      setVariables(apiVariables);

      const userVariables = { ':userEmail': userEmail, ':userID': userId };

      setVariables(userVariables);

      logAndTime('Variables set successfully');
      logSetVariables();

      localStorage.setItem('userEmail', userEmail);

      setUserEmail(userEmail);
      logAndTime('User logged in successfully');

      setLoginSuccess(true);
    } catch (error) {
      logAndTime(`Login failed: ${error.message}`);
      alert(`${fileName} Login failed. Please try again.`);
    }
  };


  useEffect(() => {
    if (loginSuccess) {
      logAndTime('Navigating to /dashboard');
      navigate('/dashboard');
    }
  }, [loginSuccess, navigate, logAndTime]);

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
