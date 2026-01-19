import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MyProfile from '../components/Profile/MyProfile';

const MyProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const handleSave = (updatedData) => {
    setUserData(updatedData);
    // Optionally navigate back or show success message
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <MyProfile 
          isOpen={true} 
          onClose={() => navigate(-1)}
          userData={userData}
          onSave={handleSave}
          isPage={true}
        />
      </div>
    </div>
  );
};

export default MyProfilePage;