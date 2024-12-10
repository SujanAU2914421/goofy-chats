// ./components/FirebaseFunctions.js
import { ref, get } from 'firebase/database';
import { database, firestore } from '@/app/components/firebase/firebase-config';

import { collection, getDocs } from 'firebase/firestore';

// Fetch users from Firestore
export const fetchFirestoreUsers = async () => {
  try {
    const usersRef = collection(firestore, 'users');
    const querySnapshot = await getDocs(usersRef);

    const users = [];
    // Loop through each document in the querySnapshot
    querySnapshot.forEach((doc) => {
      // Push user data into the users array
      users.push({
        userId: doc.id, // Firestore document ID
        ...doc.data(), // Document data (fields)
      });
    });

    return users;
  } catch (error) {
    console.error('Error fetching users from Firestore:', error.message);
    return [];
  }
};

// Fetch user presence data from Realtime Database
export const fetchRealtimeDatabasePresence = async () => {
  const presenceRef = ref(database, 'presence');
  try {
    const snapshot = await get(presenceRef);
    if (snapshot.exists()) {
      const presenceData = snapshot.val();
      const presence = [];
      for (const userId in presenceData) {
        presence.push({
          userId,
          lastOnline: presenceData[userId].lastOnline,
          online: presenceData[userId].online,
        });
      }
      return presence;
    } else {
      return [];
    }
  } catch (error) {
    console.error(
      'Error fetching presence data from Realtime Database:',
      error
    );
    return [];
  }
};
