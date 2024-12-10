import {
  getDatabase,
  ref,
  query,
  orderByChild,
  limitToLast,
  get,
} from 'firebase/database';

const fetchLatestMessageForPair = async (userId, senderId, receiverId) => {
  try {
    // Initialize the database reference
    const db = getDatabase();

    // Define references for both key formats
    const messagesRef = ref(db, `messages/${userId}_${receiverId}/messages`);
    const reverseMessagesRef = ref(
      db,
      `messages/${receiverId}_${userId}/messages`
    );

    // Query the latest message for both directions based on 'sendTime'
    const messagesQuery = query(
      messagesRef,
      orderByChild('sendTime'), // Ensure sendTime is indexed in your Firebase database
      limitToLast(1) // Limit to the last message
    );
    const reverseMessagesQuery = query(
      reverseMessagesRef,
      orderByChild('sendTime'),
      limitToLast(1)
    );

    // Fetch messages concurrently
    const [messagesSnapshot, reverseMessagesSnapshot] = await Promise.all([
      get(messagesQuery),
      get(reverseMessagesQuery),
    ]);

    let latestMessage = null;

    // Determine the latest message from both references
    if (messagesSnapshot.exists()) {
      const messages = Object.values(messagesSnapshot.val());
      latestMessage = { ...messages[0], sent: userId === senderId }; // Add sent: true/false
    }

    if (reverseMessagesSnapshot.exists()) {
      const reverseMessages = Object.values(reverseMessagesSnapshot.val());
      if (
        !latestMessage ||
        reverseMessages[0].sendTime > latestMessage.sendTime
      ) {
        latestMessage = { ...reverseMessages[0], sent: userId === receiverId }; // Add sent: true/false
      }
    }

    return latestMessage; // Return the latest message if exists, otherwise null
  } catch (error) {
    console.error(
      `Error fetching latest message for pair (${senderId}, ${receiverId}):`,
      error
    );
    return null; // Return null in case of error
  }
};

// Update allChats with the latest message and sent property
export const updateAllChatsWithLatestMessages = async (
  userId,
  allChats,
  setAllChats
) => {
  if (!userId || !allChats || allChats.length === 0) {
    return;
  }

  try {
    // Fetch the latest message for each friend in allChats
    const promises = allChats.map(async (friend) => {
      const latestMessage = await fetchLatestMessageForPair(
        userId,
        userId,
        friend.userId
      );

      // Return the updated friend object with latest message and sent, or the original friend object
      return latestMessage
        ? {
            ...friend,
            latestMessage: {
              message: latestMessage.message,
              sent: latestMessage.sent,
              sendTime: latestMessage.sendTime,
            },
          }
        : friend;
    });

    // Wait for all promises to resolve
    const updatedChats = await Promise.all(promises);

    // Update state with the new data
    setAllChats(updatedChats);
  } catch (error) {}
};
