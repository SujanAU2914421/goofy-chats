import { getDatabase, ref, runTransaction, get } from 'firebase/database';

// Function to update a message with a reaction
export const addReactionToMessage = async (
  senderId,
  receiverId,
  messageId,
  reaction
) => {
  if (!senderId || !receiverId || !messageId || !reaction) {
    return 'Failed to add reaction';
  }

  try {
    const db = getDatabase();

    // Define the paths for both possible message paths
    const messagesRef = ref(db, `messages/${senderId}_${receiverId}/messages`);
    const reverseMessagesRef = ref(
      db,
      `messages/${receiverId}_${senderId}/messages`
    );

    // Step 1: Check if sender_receiver path exists
    const senderReceiverSnapshot = await get(messagesRef);

    if (senderReceiverSnapshot.exists()) {
      // Add reaction to sender_receiver path
      await runTransaction(messagesRef, (currentMessages) => {
        if (currentMessages && currentMessages[messageId]) {
          // Initialize reactions if it doesn't exist
          if (!currentMessages[messageId].reactions) {
            currentMessages[messageId].reactions = {};
          }

          // Check if the sender's reaction is the same as the current one
          if (currentMessages[messageId].reactions[senderId] === reaction) {
            // If the reaction is the same, remove it
            delete currentMessages[messageId].reactions[senderId];
          } else {
            // Update the reaction for the sender
            currentMessages[messageId].reactions[senderId] = reaction;
          }
          return currentMessages;
        }
        return currentMessages; // No update if message not found
      });
    } else {
      // Step 2: Check if reverse path exists if sender_receiver does not exist
      const reverseMessagesSnapshot = await get(reverseMessagesRef);

      if (reverseMessagesSnapshot.exists()) {
        // Add reaction to receiver_sender path
        await runTransaction(reverseMessagesRef, (currentMessages) => {
          if (currentMessages && currentMessages[messageId]) {
            // Initialize reactions if it doesn't exist
            if (!currentMessages[messageId].reactions) {
              currentMessages[messageId].reactions = {};
            }

            // Check if the sender's reaction is the same as the current one
            if (currentMessages[messageId].reactions[senderId] === reaction) {
              // If the reaction is the same, remove it
              delete currentMessages[messageId].reactions[senderId];
            } else {
              // Update the reaction for the sender
              currentMessages[messageId].reactions[senderId] = reaction;
            }
            return currentMessages;
          }
          return currentMessages; // No update if message not found
        });
      } else {
        return 'Message not found in either conversation'; // If the message doesn't exist in either path
      }
    }

    return 'Reaction added';
  } catch (error) {
    return 'Error adding the reaction';
  }
};
