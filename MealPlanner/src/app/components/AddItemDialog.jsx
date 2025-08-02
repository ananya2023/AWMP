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
  Tooltip,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { Plus, Calendar, ImagePlus } from 'lucide-react';
import { addPantryItems } from '../../api/pantryApi';

const CATEGORIES = [
  'Proteins', 'Dairy', 'Vegetables', 'Grains',
  'Canned Goods', 'Spices', 'Condiments', 'Gluten'
];

const UNITS = ['grams', 'ml', 'pieces','Dozen'];

const AddItemDialog = ({ isOpen, onClose }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleAdd = async () => {
    if (!itemName || !quantity || !unit || !expiryDate || categories.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user_data'));
    console.log(userData)

    const itemData = {
      name: itemName,
      categories: categories,
      quantity: parseFloat(quantity),
      unit,
      expiryDate: expiryDate,
      notes,
      image_url: imageUrl,
    };

    console.log(itemData , "item data")

    try {
      const response = await addPantryItems([itemData]);
      console.log(response)
      console.log('Item added:', itemData);

      // Reset form
      setItemName('');
      setQuantity('');
      setUnit('');
      setExpiryDate('');
      setCategories([]);
      setNotes('');
      setImageUrl('');

      onClose();
    } catch (err) {
      alert('Failed to add item. Please try again.');
    }
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
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Quantity *"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Unit *</InputLabel>
              <Select
                label="Unit *"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                {UNITS.map((u) => (
                  <MenuItem key={u} value={u}>{u}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <FormControl fullWidth>
            <InputLabel>Category *</InputLabel>
            <Select
              multiple
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              input={<OutlinedInput label="Category" />}
              renderValue={(selected) => (
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Stack>
              )}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
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

          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <TextField
            label="Image URL"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            InputProps={{
              startAdornment: (
                <IconButton disabled edge="start" sx={{ mr: 1 }}>
                  <ImagePlus size={16} />
                </IconButton>
              ),
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
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
