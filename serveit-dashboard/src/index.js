// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import the Tailwind CSS file
import App from './App';

import { ThemeProvider } from "@material-tailwind/react";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  </React.StrictMode>
);