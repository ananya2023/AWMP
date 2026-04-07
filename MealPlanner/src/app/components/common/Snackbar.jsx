import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const Snackbar = ({ message, type = 'error', isOpen, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm`}>
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;