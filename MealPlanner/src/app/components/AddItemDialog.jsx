import React, { useState, useEffect } from 'react';
import { Plus, Calendar, ImagePlus, X } from 'lucide-react';
import { addPantryItems } from '../../api/pantryApi';
import { getUserCategories, addUserCategory } from '../../api/categoriesApi';
import Snackbar from './Snackbar';

const CATEGORIES = [
  { id: 'Proteins', label: 'Proteins', emoji: '🥩', image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'Dairy', label: 'Dairy', emoji: '🥛', image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'Vegetables', label: 'Vegetables', emoji: '🥕', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'Fruits', label: 'Fruits', emoji: '🍎', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'Grains', label: 'Grains', emoji: '🌾', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'Canned Goods', label: 'Canned Goods', emoji: '🥫', image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'Spices', label: 'Spices', emoji: '🌶️', image: 'https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'Condiments', label: 'Condiments', emoji: '🍯', image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'Gluten', label: 'Gluten', emoji: '🍞', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=150' }
];

const UNITS = ['grams', 'ml', 'pieces','Dozen'];

const AddItemDialog = ({ isOpen, onClose, onItemsAdded, embedded = false }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [userCategories, setUserCategories] = useState([]);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    loadUserCategories();
  }, []);

  const loadUserCategories = async () => {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (userData?.user_id) {
      try {
        const response = await getUserCategories(userData.user_id);
        setUserCategories(response.data);
      } catch (error) {
        console.error('Failed to load user categories:', error);
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() && !userCategories.includes(newCategoryName.trim())) {
      const userData = JSON.parse(localStorage.getItem('user_data'));
      try {
        const response = await addUserCategory(userData.user_id, newCategoryName.trim());
        setUserCategories(response.data);
        setCategories([...categories, newCategoryName.trim()]);
        setNewCategoryName('');
        setShowAddCategoryInput(false);
      } catch (error) {
        console.error('Failed to add category:', error);
      }
    }
  };

  const allCategories = [...CATEGORIES, ...userCategories.map(cat => ({ id: cat, label: cat, emoji: '📁' }))];

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

      // Show success snackbar
      setShowSnackbar(true);

      if (onItemsAdded) onItemsAdded();
      if (!embedded) onClose();
    } catch (err) {
      alert('Failed to add item. Please try again.');
    }
  };

  if (!isOpen && !embedded) return null;

  const dialogContent = (
    <>
      {!embedded && (
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
      )}

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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {allCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (categories.includes(cat.id)) {
                        setCategories(categories.filter(c => c !== cat.id));
                      } else {
                        setCategories([...categories, cat.id]);
                      }
                    }}
                    className={`p-3 rounded-xl transition-all duration-200 text-center border-2 ${
                      categories.includes(cat.id)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.emoji}</div>
                    <div className="text-xs font-medium">{cat.label}</div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAddCategoryInput(true)}
                  className="p-3 rounded-xl transition-all duration-200 text-center border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
                >
                  <div className="text-2xl mb-1">+</div>
                  <div className="text-xs font-medium">Add Category</div>
                </button>
              </div>
              
              {showAddCategoryInput && (
                <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCategoryInput(false);
                        setNewCategoryName('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((catId) => {
                    const cat = allCategories.find(c => c.id === catId);
                    return (
                      <span key={catId} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full flex items-center gap-1">
                        {cat?.emoji} {cat?.label}
                        <button 
                          type="button"
                          onClick={() => setCategories(categories.filter(c => c !== catId))}
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
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
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
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
    </>
  );

  if (embedded) {
    return (
      <>
        {dialogContent}
        <Snackbar 
          isOpen={showSnackbar}
          message="Item added successfully!"
          onClose={() => setShowSnackbar(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
          {dialogContent}
        </div>
      </div>
      <Snackbar 
        isOpen={showSnackbar}
        message="Item added successfully!"
        onClose={() => setShowSnackbar(false)}
      />
    </>
  );
};

export default AddItemDialog;
