import React, { useState } from 'react';
import { X, FileText, Camera, Plus } from 'lucide-react';
import AddItemDialog from './AddItemDialog';
import ReceiptScanner from './ReceiptsScanner';

const UnifiedAddItemDialog = ({ isOpen, onClose, onItemsAdded }) => {
  const [activeTab, setActiveTab] = useState('manual');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header with tabs */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
          <div className="flex items-center justify-between p-6 pb-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Pantry Item</h2>
                <p className="text-sm text-emerald-600">Add items manually or scan with your camera</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center p-6 pt-4">
            <div className="flex bg-gray-100 rounded-lg p-1 w-full max-w-md">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'manual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Manual Entry</span>
              </button>
              <button
                onClick={() => setActiveTab('ocr')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'ocr'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span>Scan Receipt</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeTab === 'manual' ? (
            <div className="p-6">
              <AddItemDialog
                isOpen={true}
                onClose={onClose}
                onItemsAdded={onItemsAdded}
                embedded={true}
              />
            </div>
          ) : (
            <div className="p-6">
              <ReceiptScanner
                onItemsAdded={onItemsAdded}
                onClose={onClose}
                embedded={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedAddItemDialog;