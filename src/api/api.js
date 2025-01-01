// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Function to login the user
export const login = async (userEmail, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      userEmail,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Generic function to execute an event type
export const execEventType = async (eventType, params) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/execEventType`, {
      eventType,
      params
    });
    return response.data;
  } catch (error) {
    console.error(`Error executing event type ${eventType}:`, error);
    throw error;
  }
};