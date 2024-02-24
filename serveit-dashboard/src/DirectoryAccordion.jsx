import React, { useState } from 'react';
import FileItem from './FileItem';
// Import any additional icons or styles you might need

const DirectoryAccordion = ({ dirEntry, fetchDirectoryContents }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState([]);

  const toggleAccordion = async () => {
    setIsOpen(!isOpen);

    if (!isOpen && children.length === 0) {
      try {
        const contents = await fetchDirectoryContents(dirEntry.path);
        setChildren(contents);
      } catch (error) {
        console.error('Error fetching directory contents:', error);
        // Handle errors (e.g., show a message to the user)
      }
    }
  };

  return (
    <div>
      <div onClick={toggleAccordion} className="directory-item">
        {/* Display the directory name and an icon indicating open/close status */}
        {dirEntry.name}
        {isOpen ? '▲' : '▼'} {/* This is a simple indicator, you can use a proper icon */}
      </div>
      {isOpen && (
        <div className="children">
          {/* Recursively render children directories or files */}
          {children.map((child) =>
            child.is_dir ? (
              <DirectoryAccordion key={child.path} dirEntry={child} fetchDirectoryContents={fetchDirectoryContents} />
            ) : (
              <FileItem key={child.path} fileEntry={child} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DirectoryAccordion;
