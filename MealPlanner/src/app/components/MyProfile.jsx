import React, { useState } from 'react';
import { X, User, ChevronDown } from 'lucide-react';
import { updateUserProfile } from '../../api/userApi'; // Adjust path accordingly

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free'];
const ALLERGIES_OPTIONS = ['Nuts', 'Gluten', 'Dairy', 'Seafood', 'Eggs', 'Soy'];

const MyProfile = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({ ...userData });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleChange('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


 

    const handleSubmit = async () => {
         const userData = JSON.parse(localStorage.getItem('user_data')); 
    try {
        const payload = {
        user_id: userData?.user_id, // Ensure user_id is passed to formData
        name: formData.name,
        email: formData.email,
        age: formData.age,
        avatar: formData.avatar,
        dietaryPreferences: formData.dietaryPreferences,
        allergies: formData.allergies
        };

        const response = await updateUserProfile(payload);
        console.log('Profile Updated:', response);

        onSave(formData); // Update local state in parent (Header)
        alert('Profile updated successfully!');
        onClose();
    } catch (error) {
        console.error('Error updating profile:', error);
        alert(error.message);
    }
    };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
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
                <label className="block">
                  <span className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer inline-block">
                    Change Photo
                  </span>
                  <input 
                    hidden 
                    accept="image/*" 
                    type="file" 
                    onChange={handleAvatarChange} 
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">Or paste Image URL below</p>
                <input
                  type="text"
                  placeholder="Paste Image URL"
                  value={formData.avatar || ''}
                  onChange={(e) => handleChange('avatar', e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleChange('age', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preferences</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.dietaryPreferences || []).map((pref, index) => (
                  <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full flex items-center gap-1">
                    {pref}
                    <button 
                      onClick={() => {
                        const newPrefs = formData.dietaryPreferences.filter((_, i) => i !== index);
                        handleChange('dietaryPreferences', newPrefs);
                      }}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <select 
                onChange={(e) => {
                  if (e.target.value && !formData.dietaryPreferences?.includes(e.target.value)) {
                    handleChange('dietaryPreferences', [...(formData.dietaryPreferences || []), e.target.value]);
                  }
                  e.target.value = '';
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select dietary preferences...</option>
                {DIETARY_OPTIONS.filter(option => !formData.dietaryPreferences?.includes(option)).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies & Restrictions</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.allergies || []).map((allergy, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full flex items-center gap-1">
                    {allergy}
                    <button 
                      onClick={() => {
                        const newAllergies = formData.allergies.filter((_, i) => i !== index);
                        handleChange('allergies', newAllergies);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <select 
                onChange={(e) => {
                  if (e.target.value && !formData.allergies?.includes(e.target.value)) {
                    handleChange('allergies', [...(formData.allergies || []), e.target.value]);
                  }
                  e.target.value = '';
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select allergies & restrictions...</option>
                {ALLERGIES_OPTIONS.filter(option => !formData.allergies?.includes(option)).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
