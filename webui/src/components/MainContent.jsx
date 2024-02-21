// src/components/MainContent.jsx
import React from 'react';

const MainContent = ({ content }) => {
  return (
    <div className="flex-1 p-10">
      <div className="bg-light-blue p-6 rounded-lg shadow-md">
        <p className="text-dark-blue">{content}</p>
      </div>
    </div>
  );
};

export default MainContent;

