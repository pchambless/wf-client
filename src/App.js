import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { EventTypeProvider } from './context/EventTypeContext';
import { VariableProvider } from './context/VariableContext';
import { PageProvider } from './context/PageContext';
import { SelectProvider } from './context/SelectContext'; 
import IngrTypes from './pages/ingredients/IngrTypes'; 
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

console.log('App component loaded');

const App = () => {
  console.log('App component rendered');

  return (
    <UserProvider>
      <VariableProvider>
        <EventTypeProvider>
          <PageProvider>
            <SelectProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/ingredients" element={<IngrTypes />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Router>
            </SelectProvider>
          </PageProvider>
        </EventTypeProvider>
      </VariableProvider>
    </UserProvider>
  );
};

export default App;
