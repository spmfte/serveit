import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Utility function to debounce rapid invocations of a function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// SearchBar component
const SearchBar = ({ placeholder, onSearch }) => {
  // State for the search input value
  const [inputValue, setInputValue] = useState('');

  // Debounced version of the search handler
  const debouncedSearch = debounce(onSearch, 300);

  // Effect that triggers the debounced search whenever the input value changes
  useEffect(() => {
    if (inputValue) {
      debouncedSearch(inputValue);
    }
  }, [inputValue]);

  return (
    <div className="flex items-center max-w-xl mx-auto py-2 px-4">
      <div className="flex border-2 rounded overflow-hidden w-full shadow-sm">
        <span className="text-gray-500 flex items-center justify-center px-3">
          {/* Icon from Heroicons (https://heroicons.dev/) */}
          🔍
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-4 py-2 leading-tight text-gray-700 bg-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
