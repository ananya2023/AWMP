import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material';
import { Plus, Calendar } from 'lucide-react';

const AddItemDialog = ({ isOpen, onClose }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [unit, setUnit] = useState('');

  const handleAdd = () => {
    if (!itemName || !quantity || !expiryDate || !unit) {
      alert('Please fill in all fields');
      return;
    }

    const newItem = {
      name: itemName,
      quantity: `${quantity} ${unit}`,
      expiryDate,
    };

    console.log('Adding new item to inventory:', newItem);

    // Reset and close
    setItemName('');
    setQuantity('');
    setExpiryDate('');
    setUnit('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Plus size={20} />
          <Typography variant="h6">Add Item to Inventory</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            label="Item Name *"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g., Chicken Breast, Tomatoes"
          />
          <TextField
            label="Quantity *"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 500"
          />
          <FormControl fullWidth>
            <InputLabel>Unit *</InputLabel>
            <Select
              label="Unit *"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <Tooltip title="Grams" placement="right">
                <MenuItem value="gms">gms</MenuItem>
              </Tooltip>
              <Tooltip title="Milliliters" placement="right">
                <MenuItem value="mls">mls</MenuItem>
              </Tooltip>
              <Tooltip title="Pieces" placement="right">
                <MenuItem value="pcs">pcs</MenuItem>
              </Tooltip>
            </Select>
          </FormControl>
          <TextField
            label="Expiry Date *"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            InputProps={{
              startAdornment: (
                <IconButton disabled edge="start" sx={{ mr: 1 }}>
                  <Calendar size={16} />
                </IconButton>
              ),
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          sx={{ backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}
          startIcon={<Plus size={16} />}
        >
          Add to Inventory
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;
