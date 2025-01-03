import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { EventTypeProvider } from './context/EventTypeContext';
import { VariableProvider } from './context/VariableContext'; // Import VariableProvider
import { PageProvider } from './context/PageContext'; // Import PageProvider
import IngrTypes from './pages/ingredients/IngrTypes'; 
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

console.log('App component loaded'); // Simple console log test

const App = () => {
  console.log('App component rendered'); // Simple console log test inside component

  return (
    <UserProvider>
      <EventTypeProvider>
        <VariableProvider>
          <PageProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Login />} /> {/* Set Login as default */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ingredients" element={<IngrTypes />} />
                <Route path="/login" element={<Login />} /> {/* Route for Login */}
                {/* Add other routes as needed */}
              </Routes>
            </Router>
          </PageProvider>
        </VariableProvider>
      </EventTypeProvider>
    </UserProvider>
  );
};

export default App;
