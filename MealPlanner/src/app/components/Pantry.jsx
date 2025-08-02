import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import InventoryTracker from './InventoryTracker';
import ReceiptScanner from './ReceiptsScanner';

const Pantry = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Paper sx={{ mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="My Pantry" />
          <Tab label="Scan Receipt" />
        </Tabs>
      </Paper>
      
      <Box>
        {activeTab === 0 && <InventoryTracker />}
        {activeTab === 1 && <ReceiptScanner />}
      </Box>
    </Box>
  );
};

export default Pantry;