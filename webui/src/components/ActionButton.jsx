// src/components/ActionButton.jsx
import React from 'react';

const ActionButton = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-light-blue text-dark-blue font-semibold py-2 px-4 rounded shadow hover:bg-dark-blue hover:text-white"
    >
      {label}
    </button>
  );
};

export default ActionButton;

