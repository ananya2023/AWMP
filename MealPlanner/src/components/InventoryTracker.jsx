import React, { useState } from 'react';
import { Plus, Clock, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  Divider
} from '@mui/material';
import AddItemDialog from './AddItemDialog';

const InventoryTracker = () => {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  const inventoryItems = [
    { id: 1, name: 'Bananas', quantity: '3 pieces', expiresIn: 2, category: 'fruit' },
    { id: 2, name: 'Chicken Breast', quantity: '500g', expiresIn: 1, category: 'meat' },
    { id: 3, name: 'Spinach', quantity: '1 bag', expiresIn: 3, category: 'vegetable' },
    { id: 4, name: 'Milk', quantity: '1L', expiresIn: 4, category: 'dairy' },
    { id: 5, name: 'Carrots', quantity: '1kg', expiresIn: 7, category: 'vegetable' },
  ];

  const getUrgencyProps = (days) => {
    if (days <= 1)
      return {
        color: '#b91c1c',
        background: '#fee2e2',
        icon: <AlertTriangle size={14} style={{ marginRight: 4 }} />,
      };
    if (days <= 3)
      return {
        color: '#92400e',
        background: '#fed7aa',
        icon: <Clock size={14} style={{ marginRight: 4 }} />,
      };
    return {
      color: '#166534',
      background: '#bbf7d0',
      icon: <Clock size={14} style={{ marginRight: 4 }} />,
    };
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
              const urgency = getUrgencyProps(item.expiresIn);
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
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantity}
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      <Box display="flex" alignItems="center">
                        {urgency.icon}
                        <span>{item.expiresIn}d left</span>
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
              2 items expiring soon — check recipe suggestions
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <AddItemDialog
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
      />
    </>
  );
};

export default InventoryTracker;
