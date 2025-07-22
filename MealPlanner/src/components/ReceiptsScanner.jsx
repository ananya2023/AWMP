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
  const [receiptDetails, setReceiptDetails] = useState(null); // New state for vendor, date, total etc.
  
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
    console.log("Scan initiated...");
    setIsScanning(true);
    setScannedItems([]); // Clear previous items
    setReceiptDetails(null); // Clear previous details
    setShowConfirmation(false); // Reset confirmation state

    const formData = new FormData();

    formData.append('receiptImage', file); 

    try {

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_API_URL}/upload-receipt`, {
        method: 'POST',
        body: formData,
        credentials: 'include' // Only needed if you're using sessions/cookies
      });
      console.log(response , "API response object")

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to scan receipt');
      }

      // The backend now returns { message, ocrText, extractedData: { items, vendor_name, etc. }}
      const responseData = await response.json();
      console.log(responseData , 'Full response from AI backend');
      
      const extractedData = responseData.extractedData;

      if (extractedData && extractedData.items && Array.isArray(extractedData.items)) {
        const formattedItems = extractedData.items.map((item, index) => ({
          id: `${Date.now()}-${index}`, // Ensure unique ID
          name: item.name || 'Unknown Item',
          quantity: item.quantity || 1, // Default to 1 if not extracted
          expiryDate: '', // User will set this
        }));
        
        setScannedItems(formattedItems);
        
        // Set other receipt details like vendor, date, totals
        setReceiptDetails({
            vendor_name: extractedData.vendor_name || 'N/A',
            date: extractedData.date || 'N/A',
            subtotal: extractedData.subtotal || 'N/A',
            tax: extractedData.tax || 'N/A',
            total: extractedData.total || 'N/A',
        });

        setShowConfirmation(true);
      } else {
          // Handle cases where AI might not find items or returns malformed data
          alert("AI could not extract items in the expected format. Please try another receipt or check the backend logs.");
          setScannedItems([]);
          setReceiptDetails(null);
      }

    } catch (error) {
      console.error("Error during scanning:", error);
      alert(`Error scanning receipt: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };
  
  const updateItemQuantity = (id, newQuantity) => {
    // Ensure quantity is a number
    const quantity = parseInt(newQuantity, 10);
    setScannedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: isNaN(quantity) ? '' : quantity } : item
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
    console.log('Receipt Details:', receiptDetails);
    // Here you would typically send scannedItems and receiptDetails to your database/pantry API
    
    // Reset state after confirmation
    setScannedItems([]);
    setReceiptDetails(null);
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
            {scannedItems.length > 0 ? (
              scannedItems.map((item) => (
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
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                          InputProps={{
                            startAdornment: <Edit3 size={16} style={{ marginRight: 8 }} />
                          }}
                          type="number" // Ensure numeric input
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
                          helperText={!item.expiryDate ? "Expiry date required" : ""}
                          InputProps={{
                            startAdornment: <Calendar size={16} style={{ marginRight: 8 }} />
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))
            ) : (
                <Grid item xs={12}>
                    <Typography variant="body1" align="center" color="textSecondary">
                        No items were extracted. Please try another receipt.
                    </Typography>
                </Grid>
            )}
          </Grid>
          <Box mt={4} display="flex" gap={2}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleConfirmItems}
              disabled={scannedItems.length === 0} // Disable if no items to add
            >
              Add {scannedItems.length} Items to Pantry
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setScannedItems([]);
                setReceiptDetails(null);
                setShowConfirmation(false);
              }}
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
              This may take a few seconds (powered by AI)
            </Typography>
          </Box>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/png, image/jpeg, application/pdf" // AI can often handle PDF as well
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