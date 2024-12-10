import {
  fetchFirestoreUsers,
  fetchRealtimeDatabasePresence,
} from './firebaseFriends';

export const getAllFriendsData = async (
  setLoading,
  setUsersDetails,
  userId
) => {
  try {
    setLoading(true);

    // Fetch Firestore and Realtime Database data
    const firestoreUsers = await fetchFirestoreUsers();
    const presenceData = await fetchRealtimeDatabasePresence();

    // Find the current user's details from Firestore
    const currentUser = firestoreUsers.find((user) => user.userId === userId);

    // Extract the current user's friends array from the object structure
    const currentUserFriends = Object.values(currentUser?.friends || []).map(
      (friend) => friend.userId
    );

    // Merge Firestore user details with Realtime Database presence data
    const mergedUserDetails = firestoreUsers.map((user) => {
      const presence = presenceData.find((p) => p.userId === user.userId);
      return {
        ...user,
        ...(presence || {}),
      };
    });

    // Filter users based on mutual friendship criteria
    const validatedUserDetails = mergedUserDetails.filter((mergedUser) => {
      // Extract the friends array from the merged user's friends object
      const mergedUserFriends = Object.values(mergedUser.friends || []).map(
        (friend) => friend.userId
      );

      // Check mutual friendship
      const isCurrentUserInFriends = mergedUserFriends.includes(userId);
      const isMergedUserInCurrentUserFriends = currentUserFriends.includes(
        mergedUser.userId
      );

      return isCurrentUserInFriends && isMergedUserInCurrentUserFriends;
    });

    return validatedUserDetails;
  } catch (error) {
    return [];
  } finally {
    setLoading(false);
  }
};
