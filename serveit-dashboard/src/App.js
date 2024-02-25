// src/App.js
import React, { useState } from 'react';
import { SidebarWithSearch } from './components/Sidebar';
import FileEditor from './components/FileEditor';
import { fetchFileContent, saveFileContent } from './services/fileService';

const App = () => {
  const [selectedFilePath, setSelectedFilePath] = useState('');

  return (
    <div className="App">
      <SidebarWithSearch onFileSelect={setSelectedFilePath} />
      {selectedFilePath && (
        <FileEditor
          filePath={selectedFilePath}
          fetchFileContent={fetchFileContent}
          saveFileContent={saveFileContent}
        />
      )}
    </div>
  );
};

export default App;
