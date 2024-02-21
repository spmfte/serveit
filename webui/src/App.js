import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
  // Ensure the initial currentPath state is set appropriately for your directory structure
  // For example, if you're listing the root, you might use an empty string or a specific starting directory
  const fetchPath = currentPath === '/' ? '' : currentPath; // Adjust based on your routing logic
  fetch(`http://localhost:3030/list/${encodeURIComponent(fetchPath)}`)
    .then(response => response.json())
    .then(data => setFiles(data))
    .catch(error => console.error('Error fetching file data:', error));
}, [currentPath]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>File Server UI</h1>
      </header>
      <div>
        {files.map((file, index) => (
          <p key={index}>
            {file.isDir ? (
              <button onClick={() => setCurrentPath(file.path)}>{file.name}</button>
            ) : (
              file.name
            )}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
