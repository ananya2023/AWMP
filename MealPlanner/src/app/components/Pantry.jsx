import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Search, Calendar, Trash2, Edit3, ChevronDown, Camera, FileText } from 'lucide-react';
import AddItemDialog from './AddItemDialog';
import EditItemDialog from './EditItemDialog';
import ReceiptScanner from './ReceiptsScanner';
import { getPantryItems, deletePantryItem, updatePantryItem } from '../../api/pantryApi';

const Pantry = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const [pantryItems, setPantryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      await deletePantryItem(itemId);
      fetchPantryItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowEditDialog(true);
  };

  const handleUpdateItem = async (itemId, updateData) => {
    try {
      await updatePantryItem(itemId, updateData);
      fetchPantryItems();
    } catch (error) {
      console.error('Failed to update item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  const fetchPantryItems = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData?.user_id) {
        console.error("No user_id found in localStorage.");
        return;
      }
      const items = await getPantryItems(userData.user_id);
      
      // Transform API data to match UI format
      const transformedItems = items.map(item => {
        const calculateDaysLeft = (expiryDateStr) => {
          if (!expiryDateStr) return 999;
          const expiry = new Date(expiryDateStr);
          const today = new Date();
          const diffTime = expiry - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays > 0 ? diffDays : 0;
        };
        
        const daysLeft = calculateDaysLeft(item.expiry_date);
        let status = 'fresh';
        if (daysLeft === 0) status = 'expired';
        else if (daysLeft === 1) status = 'expiring-today';
        else if (daysLeft <= 3) status = 'expiring-soon';
        else if (daysLeft <= 7) status = 'good';
        
        return {
          id: item.id,
          name: item.item_name,
          category: item.categories?.[0]?.toLowerCase() || 'other',
          quantity: `${item.quantity} ${item.unit}`,
          expiryDate: item.expiry_date,
          daysLeft,
          location: 'Pantry',
          status,
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'
        };
      });
      
      setPantryItems(transformedItems);
    } catch (error) {
      console.error("Failed to fetch pantry items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPantryItems();
  }, []);

  const mockItems = [
    {
      id: 1,
      name: 'Carrots',
      category: 'vegetables',
      quantity: '2 lbs',
      expiryDate: '2024-03-20',
      daysLeft: 2,
      location: 'Refrigerator',
      status: 'expiring-soon',
      image: 'https://images.pexels.com/photos/33239/carrots-vegetables-market-organic.jpg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 2,
      name: 'Bananas',
      category: 'fruits',
      quantity: '6 pieces',
      expiryDate: '2024-03-19',
      daysLeft: 1,
      location: 'Counter',
      status: 'expiring-today',
      image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 3,
      name: 'Bread',
      category: 'grains',
      quantity: '1 loaf',
      expiryDate: '2024-03-18',
      daysLeft: 0,
      location: 'Pantry',
      status: 'expired',
      image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 4,
      name: 'Spinach',
      category: 'vegetables',
      quantity: '1 bag',
      expiryDate: '2024-03-25',
      daysLeft: 7,
      location: 'Refrigerator',
      status: 'fresh',
      image: 'https://images.pexels.com/photos/2518055/pexels-photo-2518055.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 5,
      name: 'Rice',
      category: 'grains',
      quantity: '2 cups leftover',
      expiryDate: '2024-03-21',
      daysLeft: 3,
      location: 'Refrigerator',
      status: 'good',
      image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 6,
      name: 'Tomatoes',
      category: 'vegetables',
      quantity: '4 pieces',
      expiryDate: '2024-03-22',
      daysLeft: 4,
      location: 'Counter',
      status: 'good',
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 7,
      name: 'Milk',
      category: 'dairy',
      quantity: '1/2 gallon',
      expiryDate: '2024-03-24',
      daysLeft: 6,
      location: 'Refrigerator',
      status: 'fresh',
      image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 8,
      name: 'Eggs',
      category: 'dairy',
      quantity: '8 pieces',
      expiryDate: '2024-03-28',
      daysLeft: 10,
      location: 'Refrigerator',
      status: 'fresh',
      image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  const displayItems = pantryItems.length > 0 ? pantryItems : mockItems;

  const categories = [
    { id: 'all', label: 'All Items', count: displayItems.length },
    { id: 'vegetables', label: 'Vegetables', count: displayItems.filter(item => item.category === 'vegetables').length },
    { id: 'fruits', label: 'Fruits', count: displayItems.filter(item => item.category === 'fruits').length },
    { id: 'grains', label: 'Grains', count: displayItems.filter(item => item.category === 'grains').length },
    { id: 'dairy', label: 'Dairy', count: displayItems.filter(item => item.category === 'dairy').length },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expiring-today':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expiring-soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fresh':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'expired' || status === 'expiring-today' || status === 'expiring-soon') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return null;
  };

  const filteredItems = displayItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const urgentItems = displayItems.filter(item => 
    item.status === 'expired' || item.status === 'expiring-today' || item.status === 'expiring-soon'
  );

  if (showReceiptScanner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowReceiptScanner(false)}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Pantry
          </button>
        </div>
        <ReceiptScanner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pantry</h2>
          <p className="text-gray-600">Track your ingredients and prevent waste</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowAddDropdown(!showAddDropdown)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {showAddDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-2">
                <button 
                  onClick={() => {
                    setShowAddDialog(true);
                    setShowAddDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200"
                >
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Manual Entry</div>
                    <div className="text-sm text-gray-500">Add items one by one</div>
                  </div>
                </button>
                <button 
                  onClick={() => {
                    setShowReceiptScanner(true);
                    setShowAddDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200"
                >
                  <Camera className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">Scan Receipt</div>
                    <div className="text-sm text-gray-500">Upload grocery receipt</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Urgent Items Alert */}
      {urgentItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-red-500 p-3 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Urgent: Items Need Attention!</h3>
              <p className="text-red-800 mb-3">
                You have <strong>{urgentItems.length} items</strong> that are expired or expiring soon. 
                Act now to prevent waste!
              </p>
              <div className="flex flex-wrap gap-2">
                {urgentItems.map((item) => (
                  <span key={item.id} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                    {item.name} ({item.daysLeft === 0 ? 'expired' : `${item.daysLeft} day${item.daysLeft === 1 ? '' : 's'}`})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search pantry items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Pantry Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditItem(item);
                  }}
                  className="p-1 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="p-1 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              {getStatusIcon(item.status) && (
                <div className="absolute top-2 left-2">
                  <div className={`p-1 rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.quantity}</p>

              {/* Status */}
              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border mb-3 ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
                <span>
                  {item.daysLeft === 0 ? 'Expired' : 
                   item.daysLeft === 1 ? '1 day left' : 
                   `${item.daysLeft} days left`}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Location:</span>
                  <span className="font-medium">{item.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Expires:</span>
                  <span className="font-medium">{new Date(item.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 space-y-2">
                {(item.status === 'expired' || item.status === 'expiring-today' || item.status === 'expiring-soon') && (
                  <button className="w-full px-3 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors duration-200">
                    Find Recipes
                  </button>
                )}
                <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{displayItems.length}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{urgentItems.length}</p>
              <p className="text-sm text-gray-600">Need Attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {displayItems.filter(item => item.status === 'fresh').length}
              </p>
              <p className="text-sm text-gray-600">Fresh Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">92%</p>
              <p className="text-sm text-gray-600">Utilization Rate</p>
            </div>
          </div>
        </div>
      </div>

      <AddItemDialog
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          fetchPantryItems();
        }}
      />
      
      <EditItemDialog
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSave={handleUpdateItem}
      />
    </div>
  );
};

export default Pantry;