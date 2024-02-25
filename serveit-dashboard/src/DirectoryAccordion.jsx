import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { ChevronRightIcon, ChevronDownIcon, FolderIcon, DocumentTextIcon } from "@heroicons/react/24/solid";

const DirectoryAccordion = ({ directory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    if (isOpen && contents.length === 0) {
      fetch(`/list/${encodeURIComponent(directory.path)}`)
        .then((response) => response.json())
        .then((data) => setContents(data))
        .catch((error) => console.error("Error loading directory contents", error));
    }
  }, [isOpen, directory.path, contents.length]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const FileOrDirectoryItem = (item) => {
    return item.is_dir ? (
      <DirectoryAccordion key={item.path} directory={item} />
    ) : (
      <ListItem key={item.path}>
        <ListItemPrefix>
          <DocumentTextIcon className="h-5 w-5" />
        </ListItemPrefix>
        {item.name}
      </ListItem>
    );
  };

  return (
    <Accordion open={isOpen}>
      <ListItem className="p-0" onClick={toggleAccordion}>
        <AccordionHeader className="border-b-0 p-3">
          <ListItemPrefix>
            <FolderIcon className="h-5 w-5" />
          </ListItemPrefix>
          <Typography color="blue-gray" className="mr-auto font-normal">
            {directory.name}
          </Typography>
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </AccordionHeader>
      </ListItem>
      <AccordionBody className="py-1">
        {contents.map(FileOrDirectoryItem)}
      </AccordionBody>
    </Accordion>
  );
};

export default DirectoryAccordion;
