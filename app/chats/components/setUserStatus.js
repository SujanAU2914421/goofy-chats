// ./components/updateUserStatus.js
import { database } from '@/app/components/firebase/firebase-config';
import { onDisconnect, ref, set } from '@firebase/database';

// Function to update user presence status in Firebase Realtime Database
export const updateUserStatus = () => {
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  if (!userId) {
    console.error('User ID not found in localStorage');
    return;
  }

  const presenceRef = ref(database, 'presence/' + userId);

  // Set the user's status to 'online'
  set(presenceRef, {
    online: true,
    lastOnline: null, // No last online time when the user is online
  });

  // Set up a Firebase disconnect handler to mark the user as offline when they disconnect
  onDisconnect(presenceRef).set({
    online: false,
    lastOnline: Date.now(), // Store the current timestamp when the user goes offline
  });

  // Optionally, we can monitor when the user goes offline and take further actions if needed
};
