// src/App.jsx
import React from 'react';
import './App.css'; // Make sure to import the CSS file for global styles
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ActionButton from './components/ActionButton';

const App = () => {
  const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit...";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col w-full">
        <MainContent content={content} />
        <div className="p-10">
          <ActionButton label="Copy All" onClick={() => console.log("Copied")} />
        </div>
      </div>
    </div>
  );
};

export default App;

