// ./components/ReceiveMessages.js
import { getDatabase, ref, onValue } from 'firebase/database';

// Initialize Realtime Database
const db = getDatabase();

export function listenForMessages(currentUserId, callback) {
  const messagesRef = ref(db, 'messages');

  onValue(messagesRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const messageData = childSnapshot.val();

      // Check if the receiverId matches the current user's ID
      if (messageData.receiverId === currentUserId) {
        callback(messageData); // Pass the message data to the callback
      }
    });
  });
}
