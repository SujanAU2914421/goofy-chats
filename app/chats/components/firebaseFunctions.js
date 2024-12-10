// ./components/FirebaseFunctions.js
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { ref, get } from 'firebase/database';
import { database } from '@/app/components/firebase/firebase-config';

// Fetch users from Firestore
export const fetchFirestoreUsers = async () => {
  try {
    const db = getFirestore();
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        userId: doc.id, // Firestore document ID
        ...doc.data(), // All document data
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
