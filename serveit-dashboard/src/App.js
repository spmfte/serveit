// src/App.js
import React, { useState } from 'react';
import { SidebarWithSearch } from './components/Sidebar';
import FileEditor from './components/FileEditor';

const App = () => {
  const [selectedFilePath, setSelectedFilePath] = useState('');

  return (
    <div className="App">
      <SidebarWithSearch onFileSelect={setSelectedFilePath} />
      {selectedFilePath && (
        <FileEditor filePath={selectedFilePath} />
      )}
    </div>
  );
};

export default App;
