import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
  Stack,
  Chip,
  Autocomplete
} from '@mui/material';

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


  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} mt={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={formData.avatar} sx={{ width: 80, height: 80 }} />
            <Box>
              <Button variant="outlined" component="label">
                Change Photo
                <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
              </Button>
              <Typography variant="caption" display="block">Or paste Image URL below</Typography>
              <TextField
                size="small"
                placeholder="Paste Image URL"
                value={formData.avatar}
                onChange={(e) => handleChange('avatar', e.target.value)}
              />
            </Box>
          </Box>

          <TextField
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />

          <TextField
            label="Age"
            fullWidth
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleChange('age', e.target.value)}
          />

          <Autocomplete
            multiple
            options={DIETARY_OPTIONS}
            value={formData.dietaryPreferences || []}
            onChange={(e, newValue) => handleChange('dietaryPreferences', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} key={index} />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Dietary Preferences" />}
          />

          <Autocomplete
            multiple
            options={ALLERGIES_OPTIONS}
            value={formData.allergies || []}
            onChange={(e, newValue) => handleChange('allergies', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} key={index} />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Allergies & Restrictions" />}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} color="success">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyProfile;
