import React from 'react';
// Import any additional icons or styles you might need

const FileItem = ({ fileEntry, onFileClick }) => {
  return (
    <div onClick={() => onFileClick(fileEntry.path)} className="file-item">
      {/* Display the file name and any icons */}
      {fileEntry.name}
      {/* Add an icon or visual cue that this is a file */}
    </div>
  );
};

export default FileItem;
