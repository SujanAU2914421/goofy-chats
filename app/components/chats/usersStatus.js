import {
  ref,
  set,
  get,
  onDisconnect,
  serverTimestamp,
} from '@firebase/database';

import { database } from '../firebase/firebase-config';

// Function to check if user exists and set/update their online status
export const setUserOnlineStatus = async (userId, isOnline) => {
  const userRef = ref(database, 'presence/' + userId); // Reference to the user's presence data

  try {
    // Check if user data exists in the database
    const snapshot = await get(userRef);

    // If the user data exists, update the online status
    if (snapshot.exists()) {
      if (isOnline) {
        // User is online
        set(userRef, {
          online: true,
          lastOnline: null, // Clear lastOnline when online
        });

        // Set the disconnection handler
        onDisconnect(userRef).set({
          online: false,
          lastOnline: serverTimestamp(),
        });
      } else {
        // User is offline
        set(userRef, {
          online: false,
          lastOnline: serverTimestamp(),
        });
      }
    } else {
      // User doesn't exist in the database, create a new entry
      if (isOnline) {
        set(userRef, {
          online: true,
          lastOnline: null, // Clear lastOnline when online
        });

        // Set the disconnection handler for the new user
        onDisconnect(userRef).set({
          online: false,
          lastOnline: serverTimestamp(),
        });
      } else {
        set(userRef, {
          online: false,
          lastOnline: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    console.error('Error updating user status:', error);
  }
};
