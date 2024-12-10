import { getDatabase, ref, runTransaction, get, set } from 'firebase/database';

// Function to save a message to the database
export const saveMessage = async (senderId, receiverId, message) => {
  if (!senderId || !receiverId || !message) {
    return 'failed to send message';
  }

  try {
    const db = getDatabase();

    // Define the paths for both possible message paths
    const messagesRef = ref(db, `messages//${senderId}_${receiverId}/messages`);
    const reverseMessagesRef = ref(
      db,
      `messages/${receiverId}_${senderId}/messages`
    );

    // Create the new message data with the current timestamp as sendTime
    const newMessage = {
      senderId: senderId,
      receiverId: receiverId,
      message: message,
      sendTime: Date.now(), // Use current timestamp for sendTime
    };

    // Step 1: Check if sender_receiver path exists
    const senderReceiverSnapshot = await get(messagesRef);

    if (senderReceiverSnapshot.exists()) {
      // Add message to sender_receiver path
      await runTransaction(messagesRef, (currentMessages) => {
        if (currentMessages === null) {
          return {
            [`message_${newMessage.sendTime}`]: newMessage,
          };
        } else {
          const newMessageId = `message_${newMessage.sendTime}`;
          currentMessages[newMessageId] = newMessage;
          return currentMessages;
        }
      });
    } else {
      // Step 2: Check if reverse path exists if sender_receiver does not exist
      const reverseMessagesSnapshot = await get(reverseMessagesRef);

      if (reverseMessagesSnapshot.exists()) {
        // Add message to receiver_sender path
        await runTransaction(reverseMessagesRef, (currentMessages) => {
          if (currentMessages === null) {
            return {
              [`message_${newMessage.sendTime}`]: newMessage,
            };
          } else {
            const newMessageId = `message_${newMessage.sendTime}`;
            currentMessages[newMessageId] = newMessage;
            return currentMessages;
          }
        });
      } else {
        await set(messagesRef, {
          [`message_${newMessage.sendTime}`]: newMessage,
        });
      }
    }
    return 'Message saved'; // Return some status or message ID
  } catch (error) {
    console.log('Error saving the message:', error);
  }
};
