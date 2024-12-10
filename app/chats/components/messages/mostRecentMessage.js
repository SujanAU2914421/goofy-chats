import {
  getDatabase,
  ref,
  query,
  orderByChild,
  limitToLast,
  get,
} from 'firebase/database';

export const recentMessage = async (userId, friendId) => {
  try {
    const db = getDatabase();

    // Define both possible message paths
    const messagesRef1 = ref(db, `messages/${userId}_${friendId}/messages`);
    const messagesRef2 = ref(db, `messages/${friendId}_${userId}/messages`);

    // Query to fetch the latest message from the first path
    const q1 = query(messagesRef1, orderByChild('sentTime'), limitToLast(1));

    // Query to fetch the latest message from the second path
    const q2 = query(messagesRef2, orderByChild('sentTime'), limitToLast(1));

    // Attempt to fetch from the first path
    const snapshot1 = await get(q1);

    if (snapshot1.exists()) {
      const messages = snapshot1.val();
      let lastMessage = null;

      for (let key in messages) {
        const message = messages[key];

        // Check if the message is between the user and the friend
        if (
          (message.senderId === userId && message.receiverId === friendId) ||
          (message.senderId === friendId && message.receiverId === userId)
        ) {
          lastMessage = message;
          break;
        }
      }

      if (lastMessage) {
        lastMessage.sent = lastMessage.senderId === userId;
        return lastMessage; // Return the most recent message
      }
    }

    // If no message was found in the first path, attempt the second path
    const snapshot2 = await get(q2);

    if (snapshot2.exists()) {
      const messages = snapshot2.val();
      let lastMessage = null;

      for (let key in messages) {
        const message = messages[key];

        // Check if the message is between the user and the friend
        if (
          (message.senderId === userId && message.receiverId === friendId) ||
          (message.senderId === friendId && message.receiverId === userId)
        ) {
          lastMessage = message;
          break;
        }
      }

      console.log(lastMessage);

      if (lastMessage) {
        lastMessage.sent = lastMessage.senderId === userId;
        return lastMessage; // Return the most recent message
      }
    }

    // If no messages are found in both paths
    return null;
  } catch (error) {
    console.error('Error fetching recent message:', error);
    return null;
  }
};
