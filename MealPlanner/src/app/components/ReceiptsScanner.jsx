import React, { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle, Edit3, Calendar, Trash2, StickyNote, X } from 'lucide-react';
import Lottie from 'lottie-react';
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
      <div className="bg-white border border-gray-100 rounded-2xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-600" size={20} />
            <h3 className="text-xl font-semibold text-gray-900">Confirm Scanned Items</h3>
          </div>
          <p className="text-gray-600">Review quantities, units, categories, expiry dates, and notes before confirming.</p>
        </div>
        <div className="p-6">
          {receiptDetails && (
            <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              <p className="text-sm mb-1"><strong>Vendor:</strong> {receiptDetails.vendor_name}</p>
              <p className="text-sm mb-1"><strong>Date:</strong> {receiptDetails.date}</p>
              <p className="text-sm mb-1"><strong>Subtotal:</strong> {receiptDetails.subtotal}</p>
              <p className="text-sm mb-1"><strong>Tax:</strong> {receiptDetails.tax}</p>
              <p className="text-sm"><strong>Total:</strong> {receiptDetails.total}</p>
            </div>
          )}
          <div className="space-y-4">
            {scannedItems.map(item => (
              <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <div className="relative">
                        <Edit3 size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={e => updateItemField(item.id, 'quantity', parseInt(e.target.value, 10) || '')}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <select
                        value={item.unit}
                        onChange={e => updateItemField(item.id, 'unit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {VALID_UNITS.map((unitOption) => (
                          <option key={unitOption} value={unitOption}>{unitOption}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {VALID_CATEGORIES.map(category => (
                          <button
                            key={category}
                            onClick={() => {
                              const isSelected = item.categories.includes(category);
                              const newCategories = isSelected
                                ? item.categories.filter(c => c !== category)
                                : [...item.categories, category];
                              updateItemField(item.id, 'categories', newCategories);
                            }}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                              item.categories.includes(category)
                                ? 'bg-green-100 border-green-500 text-green-700'
                                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={item.expiryDate}
                          onChange={e => updateItemField(item.id, 'expiryDate', e.target.value)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            !item.expiryDate ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {!item.expiryDate && <p className="text-red-500 text-xs mt-1">Expiry date required</p>}
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <div className="relative">
                        <StickyNote size={16} className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                          value={item.notes}
                          onChange={e => updateItemField(item.id, 'notes', e.target.value)}
                          rows={2}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleConfirmItems}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Add Items to Pantry
            </button>
            <button
              onClick={() => { setScannedItems([]); setReceiptDetails(null); setShowConfirmation(false); }}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Camera size={20} className="text-gray-700" />
          <h3 className="text-xl font-semibold text-gray-900">Quick Add from Receipt</h3>
        </div>
        <p className="text-gray-600">Scan your grocery receipt to instantly add items to your pantry</p>
      </div>
      <div className="p-6">
        {isScanning ? (
          <div className="text-center py-12">
            <Lottie 
              animationData={{
                "v": "5.7.4",
                "fr": 30,
                "ip": 0,
                "op": 90,
                "w": 100,
                "h": 100,
                "nm": "scanning",
                "ddd": 0,
                "assets": [],
                "layers": [{
                  "ddd": 0,
                  "ind": 1,
                  "ty": 4,
                  "nm": "scanner",
                  "sr": 1,
                  "ks": {
                    "o": {"a": 1, "k": [{"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [0]}, {"t": 15, "s": [100]}, {"t": 75, "s": [100]}, {"t": 90, "s": [0]}]},
                    "r": {"a": 0, "k": 0},
                    "p": {"a": 1, "k": [{"i": {"x": 0.833, "y": 0.833}, "o": {"x": 0.167, "y": 0.167}, "t": 0, "s": [50, 80, 0]}, {"t": 45, "s": [50, 20, 0]}, {"t": 90, "s": [50, 80, 0]}]},
                    "a": {"a": 0, "k": [0, 0, 0]},
                    "s": {"a": 0, "k": [100, 100, 100]}
                  },
                  "ao": 0,
                  "shapes": [{
                    "ty": "rc",
                    "p": {"a": 0, "k": [0, 0]},
                    "s": {"a": 0, "k": [60, 4]},
                    "r": {"a": 0, "k": 2},
                    "fill": {"c": {"a": 0, "k": [0.2, 0.8, 0.2, 1]}}
                  }],
                  "ip": 0,
                  "op": 90,
                  "st": 0
                }]
              }}
              style={{ width: 80, height: 80, margin: '0 auto 16px' }}
              loop
            />
            <p className="text-lg font-medium text-gray-900 mt-4">Scanning receipt and extracting items...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds (powered by AI)</p>
          </div>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/png, image/jpeg, application/pdf"
            />
            <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors">
              <Upload size={40} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-700 mb-4">
                Take a photo or upload your grocery receipt
              </p>
              <button
                onClick={triggerFileInput}
                className="flex items-center gap-2 mx-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Camera size={16} />
                Scan Receipt
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReceiptScanner;