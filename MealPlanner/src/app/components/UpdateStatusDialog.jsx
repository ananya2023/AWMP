import React, { useState } from 'react';
import { X, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import Snackbar from './Snackbar';

const UpdateStatusDialog = ({ isOpen, onClose, item, onUpdate }) => {
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [action, setAction] = useState('extend');
  const [consumedAmount, setConsumedAmount] = useState('');
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'error' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let updateData = {};
    
    if (action === 'extend' && newExpiryDate) {
      const today = new Date().toISOString().split('T')[0];
      if (newExpiryDate < today) {
        setSnackbar({
          isOpen: true,
          message: 'Expiry date cannot be in the past. Please select a future date.',
          type: 'error'
        });
        return;
      }
      updateData.expiry_date = newExpiryDate;
    } else if (action === 'consumed') {
      await onUpdate(item.id, { consumed: true });
      onClose();
      return;
    } else if (action === 'partial' && consumedAmount) {
      const currentQty = parseFloat(item.quantity) || 0;
      const consumed = parseFloat(consumedAmount);
      const remaining = currentQty - consumed;
      
      if (remaining <= 0) {
        await onUpdate(item.id, { consumed: true });
      } else {
        updateData.quantity = remaining;
      }
      onClose();
      return;
    }
    
    if (Object.keys(updateData).length > 0) {
      await onUpdate(item.id, updateData);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Update Status</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-gray-900">{item?.name || item?.item_name}</h3>
            <p className="text-sm text-gray-600">Current status: {item?.status}</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="action"
                value="extend"
                checked={action === 'extend'}
                onChange={(e) => setAction(e.target.value)}
                className="text-emerald-500"
              />
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Extend Expiry Date</div>
                <div className="text-sm text-gray-500">Update the expiration date</div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="action"
                value="partial"
                checked={action === 'partial'}
                onChange={(e) => setAction(e.target.value)}
                className="text-emerald-500"
              />
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <div className="font-medium">Partial Consumption</div>
                <div className="text-sm text-gray-500">Update remaining quantity</div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="action"
                value="consumed"
                checked={action === 'consumed'}
                onChange={(e) => setAction(e.target.value)}
                className="text-emerald-500"
              />
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Fully Consumed</div>
                <div className="text-sm text-gray-500">Remove from pantry</div>
              </div>
            </label>
          </div>

          {action === 'extend' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Expiry Date
              </label>
              <input
                type="date"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {action === 'partial' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Consumed ({item?.unit || 'units'})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={parseFloat(item?.quantity) || 0}
                value={consumedAmount}
                onChange={(e) => setConsumedAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder={`Max: ${item?.quantity || 0}`}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {item?.quantity || 0} {item?.unit || 'units'}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
      
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </div>
  );
};

export default UpdateStatusDialog;