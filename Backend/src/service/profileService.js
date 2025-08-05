const db = require('../config/firebase');  // Firestore DB config

exports.getProfile = async (user_id) => {
  try {
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('user_id', '==', user_id).limit(1).get();

    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
      user_id: userData.user_id,
      name: userData.name,
      email: userData.email,
      age: userData.age,
      avatar: userData.avatar,
      dietaryPreferences: userData.dietary_preferences || [],
      allergies: userData.allergies || []
    };
  } catch (error) {
    console.error('Service Error:', error);
    throw new Error(error.message || 'Failed to get profile');
  }
};

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
