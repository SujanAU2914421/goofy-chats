// ./components/UserFunctions.js
import {
  fetchFirestoreUsers,
  fetchRealtimeDatabasePresence,
} from './firebaseFunctions';

// Merge Firestore and Realtime Database Data
export const getAllUserDetails = async () => {
  try {
    const firestoreUsers = await fetchFirestoreUsers();
    const presenceData = await fetchRealtimeDatabasePresence();

    // Merge both arrays based on userId
    const mergedUserDetails = firestoreUsers.map((user) => {
      const presence = presenceData.find((p) => p.userId === user.userId);
      return {
        ...user,
        ...(presence || {}),
      };
    });

    return mergedUserDetails;
  } catch (error) {
    console.error('Error fetching or merging user details:', error);
    return [];
  }
};
