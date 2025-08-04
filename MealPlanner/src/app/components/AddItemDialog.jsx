import React, { useState } from 'react';
import { Plus, Calendar, ImagePlus, X } from 'lucide-react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Plus size={20} className="text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Add Item to Inventory</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select unit</option>
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categories *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((cat) => (
                  <span key={cat} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full flex items-center gap-1">
                    {cat}
                    <button 
                      onClick={() => setCategories(categories.filter(c => c !== cat))}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <select 
                onChange={(e) => {
                  if (e.target.value && !categories.includes(e.target.value)) {
                    setCategories([...categories, e.target.value]);
                  }
                  e.target.value = '';
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select categories...</option>
                {CATEGORIES.filter(cat => !categories.includes(cat)).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <div className="relative">
                <ImagePlus size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} />
            Add to Inventory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemDialog;
