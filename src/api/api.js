import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';
const fileName = 'api: ';

// Function to fetch event types
export const fetchEventTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/util/fetchEventTypes`);
    return response.data.eventTypes;
  } catch (error) {
    console.error(fileName, 'Error fetching event types:', error);
    throw error;
  }
};

// Function to fetch API columns
export const fetchApiColumns = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/util/fetchApiColumns`);
    return response.data;
  } catch (error) {
    console.error(fileName,'Error fetching API columns:', error);
    throw error;
  }
};

// Function to login user
export const login = async (email, password) => {
  try {
    const response = await fetch(`http://localhost:3001/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userEmail: email, password })
    });

    if (!response.ok) { // Updated this line
      throw new Error(fileName, `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(fileName,'Login response data:', data);
    return data; // Return the server response directly
  } catch (error) {
    console.error(fileName, 'Login error:', error);
    return { success: false, message: error.message };
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
    console.error(fileName, `Error executing event type ${eventType}:`, error);
    throw error;
  }
};
