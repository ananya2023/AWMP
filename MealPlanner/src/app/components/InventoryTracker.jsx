import React, { useState, useEffect } from 'react';
import { Plus, Clock, AlertTriangle } from 'lucide-react';
import {
  Card, CardContent, CardHeader, Typography, Button,
  Chip, Box, Stack, Divider
} from '@mui/material';
import AddItemDialog from './AddItemDialog';
import { getPantryItems } from '../api/pantryApi'; // <-- Add this import

const InventoryTracker = () => {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);

  const fetchPantryItems = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData?.user_id) {
        console.error("No user_id found in localStorage.");
        return;
      }
      const items = await getPantryItems(userData.user_id);
      console.log(items , "items")
      setInventoryItems(items);
    } catch (error) {
      console.error("Failed to fetch pantry items:", error);
    }
  };

  useEffect(() => {
    fetchPantryItems();
  }, []);

  const handleAddItemClose = () => {
    setIsAddItemOpen(false);
    fetchPantryItems();  // Re-fetch after adding
  };

  const getUrgencyProps = (daysLeft) => {
    if (daysLeft <= 1) {
      return {
        color: '#b91c1c',
        background: '#fee2e2',
        icon: <AlertTriangle size={14} style={{ marginRight: 4 }} />,
      };
    }
    if (daysLeft <= 3) {
      return {
        color: '#92400e',
        background: '#fed7aa',
        icon: <Clock size={14} style={{ marginRight: 4 }} />,
      };
    }
    return {
      color: '#166534',
      background: '#bbf7d0',
      icon: <Clock size={14} style={{ marginRight: 4 }} />,
    };
  };

  const calculateDaysLeft = (expiryDateStr) => {
    if (!expiryDateStr) return '∞';
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography>Your Inventory</Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<Plus size={16} />}
                onClick={() => setIsAddItemOpen(true)}
                sx={{ backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}
              >
                Add Item
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            {inventoryItems.map((item) => {
              const daysLeft = calculateDaysLeft(item.expiry_date);
              const urgency = getUrgencyProps(daysLeft);

              return (
                <Box
                  key={item.id}
                  p={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    backgroundColor: '#f9fafb',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#f3f4f6' },
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {item.item_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantity} {item.unit}
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      <Box display="flex" alignItems="center">
                        {urgency.icon}
                        <span>{daysLeft}d left</span>
                      </Box>
                    }
                    sx={{
                      bgcolor: urgency.background,
                      color: urgency.color,
                      border: `1px solid ${urgency.color}`,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              );
            })}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              <AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: 4, color: '#f97316' }} />
              {inventoryItems.filter(i => calculateDaysLeft(i.expiry_date) <= 3).length} items expiring soon
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <AddItemDialog
        isOpen={isAddItemOpen}
        onClose={handleAddItemClose}  // <-- refresh after add
      />
    </>
  );
};

export default InventoryTracker;
