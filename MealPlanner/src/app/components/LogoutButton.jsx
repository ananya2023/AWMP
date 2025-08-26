import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmation from './LogoutConfirmation';

const LogoutButton = ({ className = "", variant = "default", showText = true }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (variant) {
      case "danger":
        return `${baseStyles} px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${className}`;
      case "outline":
        return `${baseStyles} px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 ${className}`;
      case "ghost":
        return `${baseStyles} px-2 py-1 text-red-600 hover:bg-red-50 rounded ${className}`;
      default:
        return `${baseStyles} px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 ${className}`;
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        disabled={loading}
        className={getButtonStyles()}
      >
        <LogOut className="h-4 w-4" />
        {showText && <span>{loading ? 'Signing out...' : 'Sign Out'}</span>}
      </button>

      <LogoutConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleLogout}
        userName={auth.currentUser?.displayName}
      />
    </>
  );
};

export default LogoutButton;