import {
  getDatabase,
  ref,
  runTransaction,
  get,
  remove,
} from 'firebase/database';

// Function to delete a message from the database
export const deleteMessage = async (senderId, receiverId, messageId) => {
  if (!senderId || !receiverId || !messageId) {
    return 'failed to delete message';
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
      // Step 2: Check if the message exists and remove it
      const currentMessages = senderReceiverSnapshot.val();
      if (currentMessages && currentMessages[messageId]) {
        // Remove the specific message by its ID
        await remove(
          ref(db, `messages/${senderId}_${receiverId}/messages/${messageId}`)
        );
      } else {
      }
    } else {
      // Step 3: Check if reverse path exists if sender_receiver does not exist
      const reverseMessagesSnapshot = await get(reverseMessagesRef);

      if (reverseMessagesSnapshot.exists()) {
        // Check if the message exists in reverse path and remove it
        const reverseMessages = reverseMessagesSnapshot.val();
        if (reverseMessages && reverseMessages[messageId]) {
          // Remove the specific message by its ID
          await remove(
            ref(db, `messages/${receiverId}_${senderId}/messages/${messageId}`)
          );
        } else {
        }
      } else {
      }
    }
  } catch (error) {}
};
