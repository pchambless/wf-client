import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';
const fileName = 'api: ';

/**
 * Fetches the list of event types from the API.
 *
 * @returns {Promise<Array<{ eventType: string, params: Array, purpose: string }>>} An array of event types with their parameters and purpose.
 * @throws {Error} Throws an error if the response from the API is not an array.
 */
export const fetchEventTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/util/fetchEventTypes`);
    console.log(fileName, 'Fetched event types:', response.data.eventTypes); // Log the fetched event types

    if (!Array.isArray(response.data.eventTypes)) {
      throw new Error('Expected an array but received a different type.');
    }

    const eventTypes = response.data.eventTypes.map(event => ({
      eventType: event.eventType,
      params: JSON.parse(event.params), // Parse the params string into an array
      purpose: event.purpose
    }));
    return eventTypes;
  } catch (error) {
    console.error(fileName, 'Error fetching event types:', error);
    throw error;
  }
};

/**
 * Fetches the list of API columns from the API.
 *
 * @returns {Promise<Object>} An object containing the API columns as key-value pairs, where the key is the column's variable name and the value is an empty string with a leading colon.
 * @throws {Error} Throws an error if the response from the API is not an array.
 */
export const fetchApiColumns = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/util/fetchApiColumns`);
    const apiColumns = response.data.apiColumns;

    // Initialize variables to empty strings with leading ":"
    const variables = apiColumns.reduce((acc, column) => {
      acc[column.variableName] = ''; // Initialize with empty string, retain leading ":"
      return acc;
    }, {});

    console.log(fileName, 'apiColumns, variables:', variables); // Log the final variables for debugging

    return variables;
  } catch (error) {
    console.error(fileName, 'Error fetching API columns:', error);
    throw error;
  }
};

/**
 * Logs the user into the system using the provided email and password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} A promise that resolves to the server response data upon successful login, or a promise that rejects with an error object containing a `success` property set to `false` and a `message` property set to the error message upon login failure.
 * @throws {Error} Throws an error if the HTTP request to the server fails.
 */
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
    console.log(fileName, 'Login response data:', data);
    return data; // Return the server response directly
  } catch (error) {
    console.error(fileName, 'Login error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Executes the specified event type with the provided parameters.
 *
 * @param {string} eventType - The name of the event type to be executed.
 * @param {Object} params - An object containing the parameters required for the specified event type.
 * @returns {Promise<Object>} A promise that resolves to the server response data upon successful execution, or a promise that rejects with an error object containing a `success` property set to `false` and a `message` property set to the error message upon execution failure.
 * @throws {Error} Throws an error if the HTTP request to the server fails.
 */
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
