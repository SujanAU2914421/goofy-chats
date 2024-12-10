import { firestore } from '@/app/components/firebase/firebase-config';
import { doc, updateDoc, getDoc } from '@firebase/firestore';
import { updateUserDetails } from './updateAllUsersDetails';

export const addFriend = async (
  userIdToAdd,
  setLoading,
  usersDetails,
  setUsersDetails
) => {
  const currentUserId = localStorage.getItem('userId');
  if (!currentUserId) {
    return;
  }

  // Log usersDetails and currentUserId for debuggin

  // Variables to store the current user and the friend to be added with full details
  let currentUser = null;
  let friendUser = null;

  // Iterate through usersDetails and find the relevant users
  usersDetails.forEach((element) => {
    if (element.userId === currentUserId) {
      currentUser = element; // Store the full current user object
    }
    if (element.userId === userIdToAdd) {
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

        // Check if the user is already a friend
        const isAlreadyFriend = currentFriendsArray.some(
          (friend) => friend.userId === userIdToAdd
        );

        if (isAlreadyFriend) {
          return;
        }

        // Prepare the friend data to be added
        const newFriendData = {
          userId: friendUser.userId,
          addedAt: Date.now(), // Add the timestamp
        };

        // Update the friends array in the current user's Firestore document
        await updateDoc(currentUserRef, {
          friends: [...currentFriendsArray, newFriendData], // Add the new friend
        });

        // Update usersDetails after adding the friend
        updateUserDetails(setLoading, setUsersDetails);
      } else {
      }
    } catch (error) {}
  } else {
  }
};
