import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { EventTypeProvider } from './context/EventTypeContext';
import IngrTypes from './pages/ingredients/IngrTypes'; 
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

console.log('App component loaded'); // Simple console log test

const App = () => {
  console.log('App component rendered'); // Simple console log test inside component

  return (
    <UserProvider>
      <EventTypeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} /> {/* Set Login as default */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ingredients" element={<IngrTypes />} />
            <Route path="/login" element={<Login />} /> {/* Route for Login */}
            {/* Add other routes as needed */}
          </Routes>
        </Router>
      </EventTypeProvider>
    </UserProvider>
  );
};

export default App;
