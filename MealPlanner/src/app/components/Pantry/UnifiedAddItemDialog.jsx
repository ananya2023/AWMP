import React, { useState } from 'react';
import { X, FileText, Camera, Plus, Mic, Scan } from 'lucide-react';
import AddItemDialog from './AddItemDialog';
import ReceiptScanner from '../ReceiptsScanner';

const UnifiedAddItemDialog = ({ isOpen, onClose, onItemsAdded }) => {
  const [activeTab, setActiveTab] = useState('options');

  if (!isOpen) return null;

  const addOptions = [
    {
      id: 'voice',
      title: '🎤 Voice',
      description: 'Add items using voice commands',
      icon: <Mic className="h-6 w-6" />,
      color: 'from-blue-500 to-indigo-600',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-700'
    },
    {
      id: 'barcode',
      title: '📦 Scan Barcode',
      description: 'Scan product barcodes to add items',
      icon: <Scan className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-600',
      hoverColor: 'hover:from-purple-600 hover:to-pink-700'
    },
    {
      id: 'receipt',
      title: 'Scan Receipt',
      description: 'Upload receipt photo to extract items',
      icon: <Camera className="h-6 w-6" />,
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'hover:from-emerald-600 hover:to-teal-700'
    },
    {
      id: 'manual',
      title: '✍️ Type Manually',
      description: 'Enter item details manually',
      icon: <FileText className="h-6 w-6" />,
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add Pantry Items</h2>
                <p className="text-sm text-emerald-600 mt-1">Choose how you'd like to add items to your pantry</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeTab === 'options' ? (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {addOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setActiveTab(option.id)}
                    className={`group relative overflow-hidden bg-gradient-to-br ${option.color} ${option.hoverColor} p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-left`}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                          {option.icon}
                        </div>
                        <div className="text-white">
                          <h3 className="text-xl font-bold group-hover:scale-105 transition-transform duration-300">
                            {option.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                        {option.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    <span>Voice: Say "Add 2 apples expiring next week" for quick entry</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    <span>Barcode: Point camera at product barcode for instant details</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    <span>Receipt: Upload grocery receipt to add multiple items at once</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    <span>Manual: Full control over item details and categories</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : activeTab === 'manual' ? (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={() => setActiveTab('options')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Manual Entry</h3>
              </div>
              <AddItemDialog
                isOpen={true}
                onClose={onClose}
                onItemsAdded={onItemsAdded}
                embedded={true}
              />
            </div>
          ) : activeTab === 'receipt' ? (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={() => setActiveTab('options')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Scan Receipt</h3>
              </div>
              <ReceiptScanner
                onItemsAdded={onItemsAdded}
                onClose={onClose}
                embedded={true}
              />
            </div>
          ) : activeTab === 'voice' ? (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={() => setActiveTab('options')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Voice Input</h3>
              </div>
              <div className="text-center py-12">
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 mb-6">
                  <Mic className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Input Coming Soon!</h3>
                  <p className="text-gray-600">We're working on voice recognition to make adding items even easier.</p>
                </div>
                <button
                  onClick={() => setActiveTab('manual')}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Use Manual Entry Instead
                </button>
              </div>
            </div>
          ) : activeTab === 'barcode' ? (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={() => setActiveTab('options')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Scan Barcode</h3>
              </div>
              <div className="text-center py-12">
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-200 mb-6">
                  <Scan className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Barcode Scanner Coming Soon!</h3>
                  <p className="text-gray-600">We're developing barcode scanning to instantly identify products.</p>
                </div>
                <button
                  onClick={() => setActiveTab('manual')}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Use Manual Entry Instead
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UnifiedAddItemDialog;