// ./components/PresenceFunctions.js
import { database } from '@/app/components/firebase/firebase-config';
import { ref, onChildChanged, onValue } from 'firebase/database';

// Handle changes to user presence in Realtime Database
export const handlePresenceChange = (snapshot, setUsersDetails) => {
  if (snapshot.exists()) {
    const userId = snapshot.key; // Get userId from the snapshot
    const updatedPresence = snapshot.val(); // Get updated presence data

    setUsersDetails((prevUsersDetails) => {
      return prevUsersDetails.map((user) => {
        if (user.userId === userId) {
          return {
            ...user,
            lastOnline: updatedPresence.lastOnline,
            online: updatedPresence.online,
          };
        }
        return user;
      });
    });
  } else {
    console.log('No data found in snapshot for presence change.');
  }
};

// Fetch all users' presence and update the status
export const fetchPresenceData = (setAllUsersStatus) => {
  const presenceRef = ref(database, 'presence');

  const unsubscribeUserChanges = onValue(presenceRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      const updatedUsers = Object.entries(data).map(([userId, user]) => [
        userId,
        user.online,
        user.lastOnline,
      ]);

      setAllUsersStatus(updatedUsers);
    } else {
      console.log('No presence data found.');
    }
  });

  return unsubscribeUserChanges;
};

// Listen for individual user changes in presence
export const listenForUserChanges = (setUsersDetails) => {
  const presenceRef = ref(database, 'presence');

  const unsubscribeUserChange = onChildChanged(presenceRef, (snapshot) => {
    handlePresenceChange(snapshot, setUsersDetails);
  });

  return unsubscribeUserChange;
};
