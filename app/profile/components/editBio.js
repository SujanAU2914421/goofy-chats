import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Function to update user's bio
export const editUserBio = async (newBioText, userId) => {
  try {
    if (!userId) {
      throw new Error('Invalid parameters: userId is required.');
    }

    const db = getFirestore();
    // Reference to the user's document
    const userRef = doc(db, 'users', userId);

    // If newBioText is empty, set it as an empty string or allow null
    const bioToUpdate = newBioText || ''; // Or use `null` if you want to clear the bio

    // Update the bio field in the user's document
    await updateDoc(userRef, {
      bio: bioToUpdate,
    });

    return bioToUpdate;
  } catch (error) {
    console.error('Error updating user bio:', error);
    throw new Error('Failed to update bio');
  }
};
