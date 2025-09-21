import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const Snackbar = ({ isOpen, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-80">
        <CheckCircle size={20} />
        <span className="font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-auto hover:bg-green-700 p-1 rounded"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;