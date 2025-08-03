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
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                bgcolor: 'action.hover'
              }
            }
          }}
        >
          <Tab label="My Pantry" />
          <Tab label="Scan Receipt" />
        </Tabs>
      </Paper>
      
      <Box sx={{ 
        '& > *': {
          animation: 'fadeIn 0.3s ease-in-out'
        },
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}>
        {activeTab === 0 && <InventoryTracker />}
        {activeTab === 1 && <ReceiptScanner />}
      </Box>
    </Box>
  );
};

export default Pantry;