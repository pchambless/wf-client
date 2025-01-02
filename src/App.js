import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main'; // Import Main component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to Login */}
        <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect any other path to Login */}
      </Routes>
    </Router>
  );
}

export default App;
