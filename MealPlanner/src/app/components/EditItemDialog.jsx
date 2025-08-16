import React, { useState, useEffect } from 'react';
import { X, Calendar, Package, Hash, MapPin } from 'lucide-react';

const EditItemDialog = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    unit: 'pieces',
    expiry_date: '',
    notes: ''
  });

  useEffect(() => {
    if (item) {
      console.log('Editing item:', item);
      
      // Handle quantity parsing
      let qty = '';
      let unit = 'pieces';
      if (typeof item.quantity === 'string' && item.quantity.includes(' ')) {
        const parts = item.quantity.split(' ');
        qty = parts[0];
        unit = parts[1] || 'pieces';
      } else if (typeof item.quantity === 'number') {
        qty = item.quantity.toString();
        unit = item.unit || 'pieces';
      }
      
      // Handle date formatting
      let expiryDate = '';
      if (item.expiryDate) {
        expiryDate = new Date(item.expiryDate).toISOString().split('T')[0];
      } else if (item.expiry_date) {
        expiryDate = new Date(item.expiry_date).toISOString().split('T')[0];
      }
      
      setFormData({
        item_name: item.name || item.item_name || '',
        quantity: qty,
        unit: unit,
        expiry_date: expiryDate,
        notes: item.notes || ''
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(item.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Item</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="h-4 w-4 inline mr-2" />
              Item Name
            </label>
            <input
              type="text"
              value={formData.item_name}
              onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="h-4 w-4 inline mr-2" />
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="pieces">Pieces</option>
                <option value="grams">Grams</option>
                <option value="ml">ML</option>
                <option value="Dozen">Dozen</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Optional notes..."
            />
          </div>

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemDialog;