import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tailwind.css';
import './styles/modal.css'; // Add this line to import modal styles
import App from './App';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const login = document.getElementById('root');
const root = createRoot(login);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
