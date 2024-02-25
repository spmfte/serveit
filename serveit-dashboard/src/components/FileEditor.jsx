// FileEditor.jsx
import React, { useState, useEffect } from 'react';

const FileEditor = ({ filePath, fetchFileContent, saveFileContent }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      const fileContent = await fetchFileContent(filePath);
      setContent(fileContent);
    };

    if (filePath) {
      loadContent();
    }
  }, [filePath, fetchFileContent]);

  const handleSave = async () => {
    await saveFileContent(filePath, content);
    alert('Content saved!');
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="10"
        cols="50"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default FileEditor;
