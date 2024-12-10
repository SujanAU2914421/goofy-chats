import { getFirestore, getDoc, doc } from 'firebase/firestore';

export const fetchFriendsDetails = async (userId) => {
  try {
    const db = getFirestore();

    // Step 1: Get the current user's document using the userId as the document ID
    const currentUserRef = doc(db, 'users', userId);
    const currentUserSnap = await getDoc(currentUserRef);

    if (!currentUserSnap.exists()) {
      return [];
    }

    const currentUser = currentUserSnap.data();

    // Step 2: Check if the user has friends
    if (!currentUser.friends || currentUser.friends.length === 0) {
      return [];
    }

    // Extract friendIds from the friends array
    const friendIds = currentUser.friends.map((friend) => friend.userId);

    // Step 3: Split the friendIds array into chunks of 10
    const friendsChunks = [];
    for (let i = 0; i < friendIds.length; i += 10) {
      friendsChunks.push(friendIds.slice(i, i + 10));
    }

    // Step 4: Fetch friends' details in batches
    const friendsDetails = [];
    for (const chunk of friendsChunks) {
      // Query each friend's document directly using their userId as the document ID
      const friendsPromises = chunk.map(async (friendId) => {
        const friendRef = doc(db, 'users', friendId);
        const friendSnap = await getDoc(friendRef);

        if (friendSnap.exists()) {
          const { password, ...rest } = friendSnap.data(); // Exclude sensitive fields
          return { userId: friendId, ...rest };
        } else {
          return null; // Handle missing documents gracefully
        }
      });

      const chunkDetails = await Promise.all(friendsPromises);
      friendsDetails.push(...chunkDetails.filter((detail) => detail !== null));
    }

    return friendsDetails;
  } catch (error) {
    throw new Error('Cant fetch friends');
  }
};
