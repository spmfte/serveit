// App.js
import React from 'react';
import Sidebar from './Sidebar';
import SearchBar from './Searchbar';

const App = () => {
  const directories = [
    { name: 'Documents' },
    { name: 'Pictures' },
    { name: 'Music' },
    { name: 'Videos' },
  ];

  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };

  const handleDirectorySelect = (directory) => {
    console.log('Directory selected:', directory.name);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar directories={directories} onDirectorySelect={handleDirectorySelect} />
      <div className="flex-1 p-10">
        <SearchBar onSearch={handleSearch} />
        {/* Additional content and components go here */}
      </div>
    </div>
  );
};

export default App;
