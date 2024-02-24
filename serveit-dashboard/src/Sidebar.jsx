import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Alert,
  Input,
} from "@material-tailwind/react";
import {
  FolderIcon, // For directories
  DocumentTextIcon, // Default for files, you can add more based on file type if needed
  PowerIcon,
} from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function SidebarWithSearch({ onFileSelect }) {
  const [directoryStructure, setDirectoryStructure] = useState([]);

  useEffect(() => {
    async function fetchDirectoryStructure() {
      try {
        const response = await fetch('/list/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDirectoryStructure(data);
      } catch (error) {
        console.error("Could not fetch directory structure:", error);
        // Optionally, set an error state here to display an error message in the UI
      }
    }
  
    fetchDirectoryStructure();
  }, []);

  // Function to select an icon based on the directory entry
  const selectIcon = (isDir) => {
    return isDir ? FolderIcon : DocumentTextIcon;
  };

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      {/* Branding and Search */}
      <div className="mb-2 flex items-center gap-4 p-4">
        <img src="/logo512.png" alt="brand" className="h-8 w-8" />
        <Typography variant="h5" color="blue-gray">
          Serve.it
        </Typography>
      </div>
      <div className="p-2">
        <Input icon={<MagnifyingGlassIcon className="h-5 w-5" />} label="Search Files" />
      </div>

      {/* File Category List */}
      <List>
      {directoryStructure.map((directory, index) => (
  <ListItem key={index} onClick={() => onFileSelect(directory.path)} className="cursor-pointer p-2 hover:bg-blue-gray-50">
    <ListItemPrefix>
      {directory.is_dir ? <FolderIcon className="h-5 w-5" /> : <DocumentTextIcon className="h-5 w-5" />}
    </ListItemPrefix>
    {directory.name}
  </ListItem>
))}
      </List>

      {/* System Actions */}
      <List className="mt-4">
        <ListItem className="cursor-pointer p-2 hover:bg-blue-gray-50">
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}
