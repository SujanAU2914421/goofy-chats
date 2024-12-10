import {
  getFirestore,
  doc,
  updateDoc,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';

// Function to remove a friend from the `friends` array, check if they have the current user, and return the updated list of friend details
export const removeFriend = async (userId, friendId) => {
  try {
    if (!userId || !friendId) {
      throw new Error('Both userId and friendId are required.');
    }

    const db = getFirestore();
    const userRef = doc(db, 'users', userId);

    // Fetch the current user's data to get the current friends array
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('User not found.');
    }

    const userData = userSnap.data();
    const currentFriends = userData.friends;

    // Find the friend object to remove based on the friendId
    const friendToRemove = currentFriends.find(
      (friend) => friend.userId === friendId
    );

    if (!friendToRemove) {
      throw new Error('Friend not found.');
    }

    // Remove the entire friend object from the friends array
    await updateDoc(userRef, {
      friends: arrayRemove(friendToRemove),
    });

    // Fetch the updated user document to get the new friends array
    const updatedUserSnap = await getDoc(userRef);

    if (!updatedUserSnap.exists()) {
      throw new Error('Failed to fetch updated user data.');
    }

    const updatedUserData = updatedUserSnap.data();
    const updatedFriends = updatedUserData.friends;

    // Check if the current user is in the friend's friends list
    const friendRef = doc(db, 'users', friendId);
    const friendSnap = await getDoc(friendRef);

    if (!friendSnap.exists()) {
      throw new Error('Friend not found.');
    }

    const friendData = friendSnap.data();
    const friendFriendsList = friendData.friends || [];

    // If the current user is in the friend's friend list, add them back
    const currentUserInFriendList = friendFriendsList.find(
      (friend) => friend.userId === userId
    );

    if (currentUserInFriendList) {
      // Add the current user back to the friend's friend list if not already added
      const updatedFriendList = [
        ...friendFriendsList,
        { userId, addedAt: Date.now() },
      ];
      await updateDoc(friendRef, {
        friends: updatedFriendList,
      });
    }

    // Fetch full details for each remaining friend and add `userId` from document ID
    const friendsDetails = await Promise.all(
      updatedFriends.map(async (friend) => {
        const friendRef = doc(db, 'users', friend.userId);
        const friendSnap = await getDoc(friendRef);

        if (!friendSnap.exists()) {
          return null; // Friend not found
        }

        const friendData = friendSnap.data();
        const { password, ...friendDetails } = friendData; // Exclude password

        // Add Firestore document ID as userId
        return {
          ...friendDetails,
          userId: friendSnap.id, // Attach document ID as userId
        };
      })
    );

    // Filter out any null values in case a friend's data was not found
    return friendsDetails.filter((friend) => friend !== null);
  } catch (error) {
    throw new Error('Failed to remove friend');
  }
};
