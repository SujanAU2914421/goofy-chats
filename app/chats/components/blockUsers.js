import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { updateUserDetails } from './updateAllUsersDetails';

// Function to block a user and add them to the blocked list in Firestore
export const blockUser = async (userIdToBlock, setUsersDetails, setLoading) => {
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
      // Get the current user's data
      const currentUser = userDoc.data();

      // Check if the user has a blocked list, if not, initialize an empty array
      const blockedList = currentUser.blocked || [];

      // Check if the user to block already exists in the blocked list
      const isUserBlocked = blockedList.some(
        (blockedUser) => blockedUser.userId === userIdToBlock
      );

      if (isUserBlocked) {
        console.log('User is already in the blocked list.');
      } else {
        // Get the current timestamp (in seconds)
        const blockedTime = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

        // Block the user (add them to the blocked list with blockedTime)
        await updateDoc(userRef, {
          blocked: arrayUnion({
            userId: userIdToBlock,
            blockedTime: blockedTime, // Add blocked time as Unix timestamp
          }), // Add the user to the blocked list
        });

        console.log(`User ${userIdToBlock} successfully blocked.`);

        // Update the user details in the app
        updateUserDetails(setLoading, setUsersDetails);
      }
    } else {
      console.log('Current user not found in the database.');
    }
  } catch (error) {
    console.error('Error blocking user:', error);
  }
};
