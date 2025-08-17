import React, { useState, useEffect } from 'react';
import { X, User, Edit3, Loader2 } from 'lucide-react';
import { getUserProfile } from '../../api/userApi';

const ProfileView = ({ isOpen, onClose, userData, onEdit }) => {
  const [profileData, setProfileData] = useState(userData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userDataFromStorage = JSON.parse(localStorage.getItem('user_data'));
      if (userDataFromStorage?.user_id) {
        const response = await getUserProfile(userDataFromStorage.user_id);
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileData(userData); // Fallback to passed userData
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-gray-600">Loading profile...</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt="Avatar" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{profileData.name || 'Not set'}</h3>
                  <p className="text-gray-600">{profileData.email || 'Not set'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <p className="text-gray-900">{profileData.age || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {(profileData.dietaryPreferences || []).length > 0 ? (
                    profileData.dietaryPreferences.map((pref, index) => (
                      <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                        {pref}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">None set</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies & Restrictions</label>
                <div className="flex flex-wrap gap-2">
                  {(profileData.allergies || []).length > 0 ? (
                    profileData.allergies.map((allergy, index) => (
                      <span key={index} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">None set</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => onEdit(profileData)}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;