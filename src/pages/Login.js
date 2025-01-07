import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { useUserContext } from '../context/UserContext';
import { useVariableContext } from '../context/VariableContext'; // Import VariableContext
import { useEventTypeContext } from '../context/EventTypeContext'; // Import EventTypeContext
import logo from '../assets/wf-icon.png';
import useLogger from '../hooks/useLogger';
import { login, fetchApiColumns, fetchEventTypes } from '../api/api'; // Import fetchApiColumns and fetchEventTypes

const Login = () => {
  const fileName = '[Login] ';
  const logAndTime = useLogger(fileName);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserEmail } = useUserContext();
  const { setVariables, logSetVariables } = useVariableContext(); // Use VariableContext
  const { setEventTypes } = useEventTypeContext(); // Use EventTypeContext
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    logAndTime('Login attempt started');
    logAndTime(`Email: ${email}`);
    // Note: Not logging the password for security reasons
  
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
  
      // Fetch event types and log eventTypes
      logAndTime('Fetching event types');
      const eventTypes = await fetchEventTypes(); 
      logAndTime('Event types fetched:', eventTypes);
  
      // Set event types in context
      setEventTypes(eventTypes);
      
      // Fetch API columns and set variables
      logAndTime('Fetching API columns');
      const apiVariables = await fetchApiColumns();
      setVariables(apiVariables);
      logAndTime('Variables set successfully');
      logSetVariables(); // Log all set variables
  
      // Set userEmail in localStorage
      localStorage.setItem('userEmail', userEmail); // Add this line
  
      setUserEmail(userEmail);
      setVariables({ userEmail, userID: userId }); // Set userEmail and userID in VariableContext
      logAndTime('User logged in successfully');
  
      setLoginSuccess(true); // Set login success flag
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
