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
      }
    }
  
    fetchDirectoryStructure();
  }, []);

  const handleAccordionToggle = (path) => {
    setOpenAccordion(openAccordion === path ? null : path);
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
          entry.is_dir ? (
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
                {/* Here you will need to fetch and list the contents of the directory */}
              </AccordionBody>
            </Accordion>
          ) : (
            <ListItem key={entry.path}>
              <ListItemPrefix>
                <DocumentTextIcon className="h-5 w-5" />
              </ListItemPrefix>
              {entry.name}
            </ListItem>
          )
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
