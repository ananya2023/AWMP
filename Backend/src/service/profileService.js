const db = require('../config/firebase');  // Firestore DB config

exports.updateProfile = async (profileData) => {
  try {
    const { user_id, name, email, age, avatar, dietaryPreferences, allergies } = profileData;

    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('user_id', '==', user_id).limit(1).get();

    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;  // DocumentReference to update

    const updateData = {
      name,
      email,
      age: age ? parseInt(age) : null,
      avatar: avatar || '',
      dietary_preferences: dietaryPreferences || [],
      allergies: allergies || [],
      last_updated: new Date()
    };

    await userRef.update(updateData);

    return updateData;
  } catch (error) {
    console.error('Service Error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};
