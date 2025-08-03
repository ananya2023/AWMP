import React, { useState, useEffect } from 'react';
import { Plus, Clock, AlertTriangle } from 'lucide-react';
import {
  Card, CardContent, CardHeader, Typography, Button,
  Chip, Box, Stack, Divider
} from '@mui/material';
import Lottie from 'lottie-react';
import AddItemDialog from './AddItemDialog';
import { getPantryItems } from '../../api/pantryApi';

const InventoryTracker = () => {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPantryItems = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
          {loading ? (
            <Box textAlign="center" py={4}>
              <Lottie 
                animationData={{
                  "v": "5.7.4",
                  "fr": 30,
                  "ip": 0,
                  "op": 60,
                  "w": 100,
                  "h": 100,
                  "nm": "loading-pantry",
                  "ddd": 0,
                  "assets": [],
                  "layers": [{
                    "ddd": 0,
                    "ind": 1,
                    "ty": 4,
                    "nm": "box",
                    "sr": 1,
                    "ks": {
                      "o": {"a": 1, "k": [{"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [100]}, {"t": 30, "s": [60]}, {"t": 60, "s": [100]}]},
                      "r": {"a": 1, "k": [{"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [0]}, {"t": 60, "s": [360]}]},
                      "p": {"a": 0, "k": [50, 50, 0]},
                      "a": {"a": 0, "k": [0, 0, 0]},
                      "s": {"a": 1, "k": [{"i": {"x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833]}, "o": {"x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167]}, "t": 0, "s": [80, 80, 100]}, {"t": 30, "s": [100, 100, 100]}, {"t": 60, "s": [80, 80, 100]}]}
                    },
                    "ao": 0,
                    "shapes": [{
                      "ty": "rc",
                      "p": {"a": 0, "k": [0, 0]},
                      "s": {"a": 0, "k": [40, 40]},
                      "r": {"a": 0, "k": 5},
                      "fill": {"c": {"a": 0, "k": [0.3, 0.7, 0.3, 1]}}
                    }],
                    "ip": 0,
                    "op": 60,
                    "st": 0
                  }]
                }}
                style={{ width: 60, height: 60, margin: '0 auto 16px' }}
                loop
              />
              <Typography variant="body2" color="text.secondary">
                Loading your pantry items...
              </Typography>
            </Box>
          ) : (
            <>
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
            </>
          )}
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
