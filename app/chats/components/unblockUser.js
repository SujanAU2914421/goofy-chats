import {
  getFirestore,
  doc,
  updateDoc,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { updateUserDetails } from './updateAllUsersDetails';

// Function to unblock a user from the blocked list of the current logged-in user in Firestore
export const unblockUser = async (
  userIdToUnblock,
  setUsersDetails,
  setLoading
) => {
  console.log('clicked');

  try {
    // Get current logged-in user ID from localStorage
    const userId = localStorage.getItem('userId');

    // Get Firestore instance
    const db = getFirestore();

    // Reference to the logged-in user's document in Firestore
    const userRef = doc(db, 'users', userId);

    // Fetch the current user document
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Get the current user's blocked list
      const currentUser = userDoc.data();

      // Check if the user to unblock exists in the blocked list
      const userToUnblock = currentUser.blocked.find(
        (blockedUser) => blockedUser.userId === userIdToUnblock
      );

      if (userToUnblock) {
        // Unblock the user (remove them from the blocked list)
        await updateDoc(userRef, {
          blocked: arrayRemove(userToUnblock), // Remove the object with userIdToUnblock from the blocked list
        });

        console.log(`User ${userIdToUnblock} successfully unblocked.`);

        updateUserDetails(setLoading, setUsersDetails);
      } else {
        console.log('User not found in the blocked list.');
      }
    } else {
      console.log('Current user not found in the database.');
    }
  } catch (error) {
    console.error('Error unblocking user:', error);
  }
};
