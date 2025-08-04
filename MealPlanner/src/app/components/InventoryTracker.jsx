import React, { useState, useEffect } from 'react';
import { Plus, Clock, AlertTriangle } from 'lucide-react';
import Lottie from 'lottie-react';
import AddItemDialog from './AddItemDialog';
import { getPantryItems } from '../../api/pantryApi';

const InventoryTracker = () => {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPantryItems = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user_data'));
      if (!userData?.user_id) {
        console.error("No user_id found in localStorage.");
        return;
      }
      const items = await getPantryItems(userData.user_id);
      console.log(items , "items")
      setInventoryItems(items);
    } catch (error) {
      console.error("Failed to fetch pantry items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPantryItems();
  }, []);

  const handleAddItemClose = () => {
    setIsAddItemOpen(false);
    fetchPantryItems();  // Re-fetch after adding
  };

  const getUrgencyProps = (daysLeft) => {
    if (daysLeft <= 1) {
      return {
        color: '#b91c1c',
        background: '#fee2e2',
        icon: <AlertTriangle size={14} style={{ marginRight: 4 }} />,
      };
    }
    if (daysLeft <= 3) {
      return {
        color: '#92400e',
        background: '#fed7aa',
        icon: <Clock size={14} style={{ marginRight: 4 }} />,
      };
    }
    return {
      color: '#166534',
      background: '#bbf7d0',
      icon: <Clock size={14} style={{ marginRight: 4 }} />,
    };
  };

  const calculateDaysLeft = (expiryDateStr) => {
    if (!expiryDateStr) return '∞';
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Your Inventory</h3>
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <Lottie 
                animationData={{
                  "v": "5.7.4",
                  "fr": 30,
                  "ip": 0,
                  "op": 60,
                  "w": 100,
                  "h": 100,
                  "nm": "loading-pantry",
                  "ddd": 0,
                  "assets": [],
                  "layers": [{
                    "ddd": 0,
                    "ind": 1,
                    "ty": 4,
                    "nm": "box",
                    "sr": 1,
                    "ks": {
                      "o": {"a": 1, "k": [{"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [100]}, {"t": 30, "s": [60]}, {"t": 60, "s": [100]}]},
                      "r": {"a": 1, "k": [{"i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [0]}, {"t": 60, "s": [360]}]},
                      "p": {"a": 0, "k": [50, 50, 0]},
                      "a": {"a": 0, "k": [0, 0, 0]},
                      "s": {"a": 1, "k": [{"i": {"x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833]}, "o": {"x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167]}, "t": 0, "s": [80, 80, 100]}, {"t": 30, "s": [100, 100, 100]}, {"t": 60, "s": [80, 80, 100]}]}
                    },
                    "ao": 0,
                    "shapes": [{
                      "ty": "rc",
                      "p": {"a": 0, "k": [0, 0]},
                      "s": {"a": 0, "k": [40, 40]},
                      "r": {"a": 0, "k": 5},
                      "fill": {"c": {"a": 0, "k": [0.3, 0.7, 0.3, 1]}}
                    }],
                    "ip": 0,
                    "op": 60,
                    "st": 0
                  }]
                }}
                style={{ width: 60, height: 60, margin: '0 auto 16px' }}
                loop
              />
              <p className="text-gray-500">
                Loading your pantry items...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {inventoryItems.map((item) => {
                  const daysLeft = calculateDaysLeft(item.expiry_date);
                  const urgency = getUrgencyProps(daysLeft);

                  return (
                    <div
                      key={item.id}
                      className="p-4 flex justify-between items-center bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {item.item_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <div
                        className="flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                        style={{
                          backgroundColor: urgency.background,
                          color: urgency.color,
                          borderColor: urgency.color,
                        }}
                      >
                        {urgency.icon}
                        <span>{daysLeft}d left</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              <div className="text-center">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <AlertTriangle size={16} className="text-orange-500" />
                  {inventoryItems.filter(i => calculateDaysLeft(i.expiry_date) <= 3).length} items expiring soon
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <AddItemDialog
        isOpen={isAddItemOpen}
        onClose={handleAddItemClose}
      />
    </>
  );
};

export default InventoryTracker;
