// ReceiptScanner.jsx
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
  Paper
} from '@mui/material';
import { Upload, Camera, CheckCircle, Edit3, Calendar, Trash2 } from 'lucide-react';

const ReceiptScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
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
    console.log("clciked")
    setIsScanning(true);

    const formData = new FormData();
    formData.append('receipt', file); 

    try {
      const response = await fetch('https://3001-cs-669787748579-default.cs-asia-southeast1-palm.cloudshell.dev/api/scan-receipt', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      console.log(response , "response")

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scan receipt');
      }

      const itemsFromApi = await response.json();
      console.log(itemsFromApi , 'items from api')
      
      const formattedItems = itemsFromApi.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        name: item.name,
        quantity: item.quantity,
        expiryDate: '',
      }));
      
      setScannedItems(formattedItems);
      setShowConfirmation(true);

    } catch (error) {
      console.error("Error during scanning:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };
  
  const updateItemQuantity = (id, newQuantity) => {
    setScannedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const updateItemExpiry = (id, newExpiryDate) => {
    setScannedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, expiryDate: newExpiryDate } : item
      )
    );
  };

  const handleConfirmItems = () => {
    const itemsWithoutExpiry = scannedItems.filter(item => !item.expiryDate);
    if (itemsWithoutExpiry.length > 0) {
      alert('Please set expiry dates for all items before adding to pantry');
      return;
    }
    console.log('Adding confirmed items to pantry:', scannedItems);
    setScannedItems([]);
    setShowConfirmation(false);
  };

  const removeItem = (id) => {
    setScannedItems(items => items.filter(item => item.id !== id));
  };
  
  if (showConfirmation) {
    return (
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <CheckCircle color="green" size={20} style={{ marginRight: 8 }} />
              <Typography variant="h6">Confirm Scanned Items</Typography>
            </Box>
          }
          subheader="Please review quantities and set expiry dates before adding to your pantry"
        />
        <CardContent>
          <Grid container spacing={2}>
            {scannedItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight={600}>{item.name}</Typography>
                    <IconButton onClick={() => removeItem(item.id)} color="error">
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                        InputProps={{
                          startAdornment: <Edit3 size={16} style={{ marginRight: 8 }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        type="date"
                        value={item.expiryDate}
                        onChange={(e) => updateItemExpiry(item.id, e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        error={!item.expiryDate}
                        InputProps={{
                          startAdornment: <Calendar size={16} style={{ marginRight: 8 }} />
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box mt={4} display="flex" gap={2}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleConfirmItems}
            >
              Add {scannedItems.length} Items to Pantry
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <Camera size={20} style={{ marginRight: 8 }} />
            <Typography variant="h6">Quick Add from Receipt</Typography>
          </Box>
        }
        subheader="Scan your grocery receipt to instantly add items to your pantry"
      />
      <CardContent>
        {isScanning ? (
          <Box textAlign="center" py={5}>
            <CircularProgress color="success" />
            <Typography variant="body1" mt={2}>
              Scanning receipt and extracting items...
            </Typography>
            <Typography variant="caption" color="textSecondary">
              This may take a few seconds
            </Typography>
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
              sx={{
                p: 5,
                textAlign: 'center',
                border: '2px dashed #ccc',
                '&:hover': { borderColor: 'green' },
              }}
            >
              <Upload size={40} style={{ marginBottom: 16, color: '#9e9e9e' }} />
              <Typography variant="body1" gutterBottom>
                Take a photo or upload your grocery receipt
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={triggerFileInput}
                startIcon={<Camera size={16} />}
              >
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