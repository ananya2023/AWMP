const profileService = require('../service/profileService');

exports.getProfile = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const profile = await profileService.getProfile(user_id);

    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: profile
    });
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { user_id, name, email, age, avatar, dietaryPreferences, allergies } = req.body;

    if (!user_id || !name || !email) {
      return res.status(400).json({ message: 'user_id, name, and email are required' });
    }

    const updatedProfile = await profileService.updateProfile({
      user_id,
      name,
      email,
      age,
      avatar,
      dietaryPreferences,
      allergies
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
