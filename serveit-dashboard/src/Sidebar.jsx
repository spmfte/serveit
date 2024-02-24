import React from "react";
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
  FolderIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ArrowTrendingUpIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export function SidebarWithSearch({ onFileSelect }) {
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const directoryStructure = [
    { id: 1, name: 'Documents', icon: DocumentTextIcon },

  ];

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
        {directoryStructure.map((directory) => (
          <ListItem key={directory.id} onClick={() => onFileSelect(directory.name)} className="cursor-pointer p-2 hover:bg-blue-gray-50">
            <ListItemPrefix>
              <directory.icon className="h-5 w-5" />
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
