import React, { useState } from 'react';
import { ShoppingCart, Plus, Check, X } from 'lucide-react';

const SmartShoppingList = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Garlic', quantity: '2 cloves', category: 'produce', fromRecipe: 'Creamy Chicken Rice Bowl', purchased: false },
    { id: '2', name: 'Onion', quantity: '1 medium', category: 'produce', fromRecipe: 'Creamy Chicken Rice Bowl', purchased: false },
    { id: '3', name: 'Parmesan Cheese', quantity: '100g', category: 'dairy', fromRecipe: 'Creamy Chicken Rice Bowl', purchased: false },
    { id: '4', name: 'Bread', quantity: '1 loaf', category: 'bakery', purchased: true },
  ]);

  const togglePurchased = (id) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const pendingItems = items.filter((item) => !item.purchased);
  const purchasedItems = items.filter((item) => item.purchased);

  const getCategoryColor = (category) => {
    const colors = {
      produce: { background: '#d1fae5', color: '#065f46' },
      dairy: { background: '#dbeafe', color: '#1e40af' },
      bakery: { background: '#ffedd5', color: '#c2410c' },
      meat: { background: '#fee2e2', color: '#991b1b' },
    };
    return colors[category] || { background: '#e5e7eb', color: '#374151' };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-gray-900">Smart Shopping List</h2>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border">
          {pendingItems.length} items needed
        </span>
      </div>
      <div className="space-y-6">
        {pendingItems.length > 0 && (
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">Need to Buy</h3>
            <div className="space-y-2">
              {pendingItems.map((item) => {
                const colorStyle = getCategoryColor(item.category);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: colorStyle.background,
                            color: colorStyle.color,
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{item.quantity}</p>
                      {item.fromRecipe && (
                        <p className="text-xs text-emerald-600">For: {item.fromRecipe}</p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => togglePurchased(item.id)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {purchasedItems.length > 0 && (
          <div>
            <h3 className="text-base font-medium text-gray-500 mb-3">Purchased</h3>
            <div className="space-y-2">
              {purchasedItems.map((item) => {
                const colorStyle = getCategoryColor(item.category);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg opacity-75"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-500 line-through">{item.name}</span>
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: colorStyle.background,
                            color: colorStyle.color,
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{item.quantity}</p>
                    </div>
                    <button
                      onClick={() => togglePurchased(item.id)}
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      Undo
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <hr className="border-gray-200" />

        <div className="flex space-x-2 pt-2">
          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Share List
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartShoppingList;
