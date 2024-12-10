import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/app/components/firebase/firebase-config';

export const getUserData = async (userId) => {
  if (!userId) {
    console.log(
      'No user ID found in localStorage. User might not be logged in.'
    );
    return null; // Return null if user is not logged in
  }

  const userRef = doc(firestore, 'users', userId);

  try {
    // Fetch user data from Firestore
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data(); // Return user data if the document exists
    } else {
      console.log('No such user found in Firestore.');
      return null; // Return null if no user document is found
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null; // Return null if there's an error fetching the data
  }
};
