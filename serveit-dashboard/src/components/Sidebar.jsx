import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  FolderIcon,
  DocumentTextIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function SidebarWithSearch() {
  const [directoryStructure, setDirectoryStructure] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [directoryContents, setDirectoryContents] = useState({});

  useEffect(() => {
    fetchDirectoryStructure('');
  }, []);

  const fetchDirectoryStructure = async (path) => {
    try {
      const response = await fetch(`/list/${path}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDirectoryStructure(data);
      if (path) {
        // Update the contents for a specific directory path
        setDirectoryContents((prevContents) => ({
          ...prevContents,
          [path]: data,
        }));
      } else {
        // Set the root directory structure
        setDirectoryStructure(data);
      }
    } catch (error) {
      console.error("Could not fetch directory structure:", error);
    }
  };

  const handleAccordionToggle = (path) => {
    const isOpen = openAccordion === path;
    setOpenAccordion(isOpen ? null : path);
    // Fetch the directory contents if the accordion is being opened and contents are not already fetched
    if (!isOpen && !directoryContents[path]) {
      fetchDirectoryStructure(path);
    }
  };

  const renderDirectoryItem = (entry) => {
    return (
      <Accordion key={entry.path} open={openAccordion === entry.path}>
        <ListItem className="p-0">
          <AccordionHeader onClick={() => handleAccordionToggle(entry.path)} className="border-b-0 p-3">
            <ListItemPrefix>
              <FolderIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              {entry.name}
            </Typography>
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${openAccordion === entry.path ? "rotate-180" : ""}`}
            />
          </AccordionHeader>
        </ListItem>
        <AccordionBody className="py-1">
          {openAccordion === entry.path && directoryContents[entry.path] &&
            directoryContents[entry.path].map((childEntry) => (
              childEntry.is_dir ? renderDirectoryItem(childEntry) : renderFileItem(childEntry)
            ))
          }
        </AccordionBody>
      </Accordion>
    );
  };

  const renderFileItem = (entry) => {
    return (
      <ListItem key={entry.path}>
        <ListItemPrefix>
          <DocumentTextIcon className="h-5 w-5" />
        </ListItemPrefix>
        {entry.name}
      </ListItem>
    );
  };

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <img src="/logo512.png" alt="brand" className="h-10 w-10" />
        <Typography variant="h5" color="blue-gray">
          Serve.it
        </Typography>
      </div>
      <List>
        {directoryStructure.map((entry) => (
          entry.is_dir ? renderDirectoryItem(entry) : renderFileItem(entry)
        ))}
      </List>
      <ListItem className="cursor-pointer p-2 hover:bg-blue-gray-50">
        <ListItemPrefix>
          <PowerIcon className="h-5 w-5" />
        </ListItemPrefix>
        Log Out
      </ListItem>
    </Card>
  );
}