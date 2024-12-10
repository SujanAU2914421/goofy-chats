import { database } from '@/app/components/firebase/firebase-config';
import { ref, get } from 'firebase/database'; // Correct import for Firebase v9+

// Function to fetch and set messages for a specific conversation
export const fetchMessages = async (
  userId,
  currentChatUserId,
  setCurrentChatMessages
) => {
  try {
    // Check if userId, currentChatUserId, and setCurrentChatMessages are valid
    if (
      !userId ||
      !currentChatUserId ||
      typeof setCurrentChatMessages !== 'function'
    ) {
      return;
    }

    // Define the two possible conversation keys
    const conversationKey1 = `${userId}_${currentChatUserId}`;
    const conversationKey2 = `${currentChatUserId}_${userId}`;

    // Reference to the specific conversation under "messages"
    const messagesRef1 = ref(database, `messages/${conversationKey1}/messages`);
    const messagesRef2 = ref(database, `messages/${conversationKey2}/messages`);

    // Fetch the messages data for the specific conversation
    const snapshot1 = await get(messagesRef1);
    const snapshot2 = await get(messagesRef2);

    let messagesFound = false;

    // Check if the first snapshot exists and contains data
    if (snapshot1.exists()) {
      const allMessages1 = snapshot1.val();
      const filteredMessages = Object.values(allMessages1).map((message) => {
        message.sent = message.senderId === userId; // Mark sent
        return message;
      });
      setCurrentChatMessages(filteredMessages); // Set messages if found
      messagesFound = true;
    }

    // Check if the second snapshot exists and contains data
    if (!messagesFound && snapshot2.exists()) {
      const allMessages2 = snapshot2.val();
      const filteredMessages = Object.values(allMessages2).map((message) => {
        message.sent = message.senderId === userId; // Mark sent
        return message;
      });
      setCurrentChatMessages(filteredMessages); // Set messages if found
      messagesFound = true;
    }

    // If no messages found for both conversations, set an empty array
    if (!messagesFound) {
      setCurrentChatMessages([]); // Return empty array if no messages found
    }
  } catch (error) {
    setCurrentChatMessages([]); // Set empty state in case of an error
  }
};
