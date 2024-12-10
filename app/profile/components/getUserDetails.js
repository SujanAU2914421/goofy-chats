import { firestore } from '@/app/components/firebase/firebase-config'; // Correct import
import { doc, getDoc } from 'firebase/firestore'; // Modular imports

// Function to fetch user details by userId
export const getUserDetails = async (userId) => {
  try {
    // Ensure userId is provided
    if (!userId) {
      return null;
    }

    // Reference to the user's document in the "users" collection
    const userRef = doc(firestore, 'users', userId);

    // Fetch the user's document
    const userSnap = await getDoc(userRef);

    // Check if document exists
    if (!userSnap.exists()) {
      return null;
    }

    // Return user data
    return userSnap.data();
  } catch (error) {
    return null;
  }
};
