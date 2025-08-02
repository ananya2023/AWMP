import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
  Chip,
  Autocomplete,
  MenuItem
} from '@mui/material';
import { Upload, Camera, CheckCircle, Edit3, Calendar, Trash2, StickyNote } from 'lucide-react';
import { addPantryItems, getScannedItems } from '../../api/pantryApi';

const VALID_CATEGORIES = [
  'Proteins', 'Dairy', 'Vegetables', 'Grains',
  'Canned Goods', 'Spices', 'Condiments', 'Gluten'
];

const VALID_UNITS = ['grams', 'ml', 'pieces', 'Dozen'];

const ReceiptScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleScanReceipt(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleScanReceipt = async (file) => {
    setIsScanning(true);
    setScannedItems([]);
    setReceiptDetails(null);
    setShowConfirmation(false);

    const formData = new FormData();
    formData.append('receiptImage', file);

    try {
      const responseData = await getScannedItems(formData);
      const extractedData = responseData.extractedData;

      if (extractedData && extractedData.items && Array.isArray(extractedData.items)) {
        const formattedItems = extractedData.items.map((item, index) => ({
          id: `${Date.now()}-${index}`,
          name: item.name || 'Unknown Item',
          quantity: item.quantity || 1,
          unit: item.unit || 'pieces',
          categories: item.categories || [],
          expiryDate: '',
          notes: ''
        }));

        setScannedItems(formattedItems);
        setReceiptDetails({
          vendor_name: extractedData.vendor_name || 'N/A',
          date: extractedData.date || 'N/A',
          subtotal: extractedData.subtotal || 'N/A',
          tax: extractedData.tax || 'N/A',
          total: extractedData.total || 'N/A',
        });
        setShowConfirmation(true);
      } else {
        alert("AI could not extract items in the expected format.");
      }
    } catch (error) {
      console.error("Error during scanning:", error);
      alert(`Error scanning receipt: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const updateItemField = (id, field, value) => {
    setScannedItems(items =>
      items.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const handleConfirmItems = async () => {
    const itemsWithoutExpiry = scannedItems.filter(item => !item.expiryDate);
    if (itemsWithoutExpiry.length > 0) {
      alert('Please set expiry dates for all items before adding to pantry');
      return;
    }

    try {
      const payload = scannedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        expiryDate: item.expiryDate,
        categories: item.categories,
        notes: item.notes
      }));

      const response = await addPantryItems(payload);
      alert('Items added to pantry successfully!');

      setScannedItems([]);
      setReceiptDetails(null);
      setShowConfirmation(false);

    } catch (error) {
      console.error('Error adding items to pantry:', error);
      alert('Failed to add items to pantry. Please try again.');
    }
  };

  const removeItem = (id) => {
    setScannedItems(items => items.filter(item => item.id !== id));
  };

  if (showConfirmation) {
    return (
      <Card>
        <CardHeader
          title={<Box display="flex" alignItems="center"><CheckCircle color="green" size={20} style={{ marginRight: 8 }} />Confirm Scanned Items</Box>}
          subheader="Review quantities, units, categories, expiry dates, and notes before confirming."
        />
        <CardContent>
          {receiptDetails && (
            <Box mb={3} p={2} sx={{ border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <Typography variant="body2"><strong>Vendor:</strong> {receiptDetails.vendor_name}</Typography>
              <Typography variant="body2"><strong>Date:</strong> {receiptDetails.date}</Typography>
              <Typography variant="body2"><strong>Subtotal:</strong> {receiptDetails.subtotal}</Typography>
              <Typography variant="body2"><strong>Tax:</strong> {receiptDetails.tax}</Typography>
              <Typography variant="body2"><strong>Total:</strong> {receiptDetails.total}</Typography>
            </Box>
          )}
          <Grid container spacing={2}>
            {scannedItems.map(item => (
              <Grid item xs={12} key={item.id}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={600}>{item.name}</Typography>
                    <IconButton onClick={() => removeItem(item.id)} color="error">
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={item.quantity}
                        onChange={e => updateItemField(item.id, 'quantity', parseInt(e.target.value, 10) || '')}
                        InputProps={{ startAdornment: <Edit3 size={16} style={{ marginRight: 8 }} /> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        select
                        fullWidth
                        label="Unit"
                        value={item.unit}
                        onChange={e => updateItemField(item.id, 'unit', e.target.value)}
                      >
                        {VALID_UNITS.map((unitOption) => (
                          <MenuItem key={unitOption} value={unitOption}>{unitOption}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        multiple
                        options={VALID_CATEGORIES}
                        value={item.categories}
                        onChange={(e, newValue) => updateItemField(item.id, 'categories', newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                          ))
                        }
                        renderInput={(params) => <TextField {...params} label="Categories" />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        type="date"
                        value={item.expiryDate}
                        onChange={e => updateItemField(item.id, 'expiryDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        error={!item.expiryDate}
                        helperText={!item.expiryDate ? "Expiry date required" : ""}
                        InputProps={{ startAdornment: <Calendar size={16} style={{ marginRight: 8 }} /> }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes"
                        multiline
                        minRows={2}
                        value={item.notes}
                        onChange={e => updateItemField(item.id, 'notes', e.target.value)}
                        InputProps={{ startAdornment: <StickyNote size={16} style={{ marginRight: 8 }} /> }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box mt={4} display="flex" gap={2}>
            <Button fullWidth variant="contained" color="success" onClick={handleConfirmItems}>Add Items to Pantry</Button>
            <Button fullWidth variant="outlined" onClick={() => { setScannedItems([]); setReceiptDetails(null); setShowConfirmation(false); }}>Cancel</Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={<Box display="flex" alignItems="center"><Camera size={20} style={{ marginRight: 8 }} />Quick Add from Receipt</Box>}
        subheader="Scan your grocery receipt to instantly add items to your pantry"
      />
      <CardContent>
        {isScanning ? (
          <Box textAlign="center" py={5}>
            <CircularProgress color="success" />
            <Typography variant="body1" mt={2}>Scanning receipt and extracting items...</Typography>
            <Typography variant="caption" color="textSecondary">This may take a few seconds (powered by AI)</Typography>
          </Box>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/png, image/jpeg, application/pdf"
            />
            <Paper
              variant="outlined"
              sx={{ p: 5, textAlign: 'center', border: '2px dashed #ccc', '&:hover': { borderColor: 'green' } }}
            >
              <Upload size={40} style={{ marginBottom: 16, color: '#9e9e9e' }} />
              <Typography variant="body1" gutterBottom>
                Take a photo or upload your grocery receipt
              </Typography>
              <Button variant="contained" color="success" onClick={triggerFileInput} startIcon={<Camera size={16} />}>
                Scan Receipt
              </Button>
            </Paper>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReceiptScanner;