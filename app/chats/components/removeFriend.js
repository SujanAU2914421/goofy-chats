import { firestore } from '@/app/components/firebase/firebase-config';
import { doc, updateDoc, getDoc } from '@firebase/firestore';
import { updateUserDetails } from './updateAllUsersDetails';

export const removeFriend = async (
  userIdToRemove,
  setLoading,
  usersDetails,
  setUsersDetails
) => {
  const currentUserId = localStorage.getItem('userId');
  if (!currentUserId) {
    console.error('No user is logged in.');
    return;
  }

  // Log usersDetails and currentUserId for debugging
  console.log('currentUserId (from localStorage):', currentUserId);
  console.log('usersDetails:', usersDetails);

  // Variables to store the current user and the friend to be removed with full details
  let currentUser = null;
  let friendUser = null;

  // Check if usersDetails is an array
  if (!Array.isArray(usersDetails)) {
    console.error('usersDetails is not an array:', usersDetails);
    return;
  }

  // Iterate through usersDetails and find the relevant users
  usersDetails.forEach((element) => {
    if (element.userId === currentUserId) {
      currentUser = element; // Store the full current user object
    }
    if (element.userId === userIdToRemove) {
      friendUser = element; // Store the full friend user object
    }
  });

  // Check if both users are found
  if (currentUser && friendUser) {
    try {
      // Get a reference to the current user document in Firestore
      const currentUserRef = doc(firestore, 'users', currentUserId);

      // Get the current document to retrieve the existing friends array
      const currentUserDoc = await getDoc(currentUserRef);
      if (currentUserDoc.exists()) {
        // Retrieve the current friends array or initialize it if it doesn't exist
        const currentFriendsArray = currentUserDoc.data().friends || [];

        // Check if the user is a friend
        const isFriend = currentFriendsArray.some(
          (friend) => friend.userId === userIdToRemove
        );

        if (!isFriend) {
          console.log(
            `User ${friendUser.username} is not in your friends list.`
          );
          return;
        }

        // Filter out the friend to remove from the friends array
        const updatedFriendsArray = currentFriendsArray.filter(
          (friend) => friend.userId !== userIdToRemove
        );

        // Update the friends array in the current user's Firestore document
        await updateDoc(currentUserRef, {
          friends: updatedFriendsArray, // Replace the array with the updated list
        });

        console.log(
          `User ${friendUser.username} has been removed from your friends list.`
        );

        // Update usersDetails after removing the friend
        updateUserDetails(setLoading, setUsersDetails);
      } else {
        console.error('Current user document does not exist.');
      }
    } catch (error) {
      console.error('Error removing friend:', error.message);
      console.error('Full error:', error);
    }
  } else {
    console.error('One or both users not found in usersDetails.');
  }
};
