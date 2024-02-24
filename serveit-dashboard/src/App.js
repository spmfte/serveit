import React from 'react';
import { IconButton } from '@material-tailwind/react';}
import { SidebarWithSearch } from './Sidebar'; // Adjust the import path based on your file structure
import './index.css'; // Assuming this imports Tailwind CSS

const App = () => {
  return (
    <div className="App">
      <SidebarWithSearch />
      {/* Add other components as necessary */}
    </div>
  );
};

export default App;