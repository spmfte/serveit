// src/components/FileEditor.jsx
import React, { useState, useEffect } from 'react';
import { fetchFileContent, saveFileContent } from '../services/fileService'; // Adjust the path as necessary

const FileEditor = ({ filePath }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!filePath) return;
    
    // Fetch file content when `filePath` changes
    fetchFileContent(filePath)
      .then(setContent)
      .catch(error => console.error(`Failed to fetch content for ${filePath}:`, error));
  }, [filePath]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveFileContent(filePath, content);
      alert('File saved successfully.');
    } catch (error) {
      console.error(`Failed to save content for ${filePath}:`, error);
      alert('Failed to save file.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2>Editing: {filePath}</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="20"
        cols="80"
        disabled={isSaving}
      ></textarea>
      <br />
      <button onClick={handleSave} disabled={isSaving}>Save</button>
    </div>
  );
};

export default FileEditor;
