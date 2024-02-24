// Sidebar component in Sidebar.js
import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = ({ directories, onDirectorySelect }) => {
  return (
    <div className="bg-gray-800 text-white w-64 space-y-2 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <ul className="space-y-2">
        {directories.map((directory, index) => (
          <li
            key={index}
            className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            onClick={() => onDirectorySelect(directory)}
          >
            <span className="flex-1">{directory.name}</span>
            <span className="text-gray-400 text-xs">
              <i className="fas fa-chevron-right"></i> {/* Placeholder for icon, replace with actual icon component */}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  directories: PropTypes.array.isRequired,
  onDirectorySelect: PropTypes.func.isRequired,
};

export default Sidebar;
