import { ref, onChildAdded, onChildChanged, off } from 'firebase/database';
import { database } from '@/app/components/firebase/firebase-config';
import { updateAllChatsWithLatestMessages } from './fetchAllFriendsLatestChat';

export const listenForLatestMessage = (userId, setAllChats, allChats) => {
  const cleanupFunctions = [];

  console.log(allChats, userId);

  // Check if allChats is valid before proceeding
  if (!allChats || allChats.length === 0) {
    console.log('No friends in allChats, skipping listener setup.');
    return () => {}; // Return a no-op cleanup function if no friends exist
  }

  try {
    // Reference to the general 'messages' node in the database
    const messagesRef = ref(database, 'messages');

    const handleChildAddedOrChanged = (snapshot) => {
      const messageArray = snapshot.val();

      for (const messageId in messageArray) {
        const message = messageArray[messageId];

        // Ensure the message involves the current user before processing
        if (message.senderId === userId || message.receiverId === userId) {
          updateAllChatsWithLatestMessages(userId, setAllChats, allChats);
        }
      }
    };

    // Set up Firebase listeners for 'messages' node
    onChildAdded(messagesRef, handleChildAddedOrChanged);
    onChildChanged(messagesRef, handleChildAddedOrChanged);

    // Add cleanup function for the 'messages' listener
    cleanupFunctions.push(() => {
      off(messagesRef, 'child_added', handleChildAddedOrChanged);
      off(messagesRef, 'child_changed', handleChildAddedOrChanged);
    });

    // Return a cleanup function to unsubscribe from the listener when the component unmounts
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  } catch (error) {
    console.error('Error listening for latest message:', error);
    return () => {}; // Return no-op cleanup function in case of error
  }
};
