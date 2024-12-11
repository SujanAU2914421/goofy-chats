import {
  getDatabase,
  ref,
  query,
  orderByChild,
  limitToLast,
  get,
} from 'firebase/database';

const fetchLatestMessageAndNicknamesForPair = async (
  userId,
  senderId,
  receiverId
) => {
  try {
    // Initialize the database reference
    const db = getDatabase();

    // Define references for both key formats
    const messagesRef = ref(db, `messages/${userId}_${receiverId}/messages`);
    const reverseMessagesRef = ref(
      db,
      `messages/${receiverId}_${userId}/messages`
    );

    const nicknamesRef = ref(db, `messages/${userId}_${receiverId}/nicknames`);
    const reverseNicknamesRef = ref(
      db,
      `messages/${receiverId}_${userId}/nicknames`
    );

    // Query the latest message for both directions based on 'sendTime'
    const messagesQuery = query(
      messagesRef,
      orderByChild('sendTime'),
      limitToLast(1)
    );
    const reverseMessagesQuery = query(
      reverseMessagesRef,
      orderByChild('sendTime'),
      limitToLast(1)
    );

    // Fetch messages and nicknames concurrently
    const [
      messagesSnapshot,
      reverseMessagesSnapshot,
      nicknamesSnapshot,
      reverseNicknamesSnapshot,
    ] = await Promise.all([
      get(messagesQuery),
      get(reverseMessagesQuery),
      get(nicknamesRef),
      get(reverseNicknamesRef),
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

    // Check for the existence of nicknames in both directions
    const nicknames = nicknamesSnapshot.exists() ? nicknamesSnapshot.val() : {};
    const reverseNicknames = reverseNicknamesSnapshot.exists()
      ? reverseNicknamesSnapshot.val()
      : {};

    // Merge the nicknames from both directions
    const allNicknames = { ...nicknames, ...reverseNicknames };

    return { latestMessage, nicknames: allNicknames }; // Return the latest message and merged nicknames
  } catch (error) {
    console.error(
      `Error fetching latest message and nicknames for pair (${senderId}, ${receiverId}):`,
      error
    );
    return { latestMessage: null, nickname: null }; // Return null in case of error
  }
};

// Update allChats with the latest message, sent property, and nickname
export const updateAllChatsWithLatestMessages = async (
  userId,
  allChats,
  setAllChats
) => {
  if (!userId || !allChats || allChats.length === 0) {
    return;
  }

  try {
    // Fetch the latest message and nickname for each friend in allChats
    const promises = allChats.map(async (friend) => {
      const { latestMessage, nicknames } =
        await fetchLatestMessageAndNicknamesForPair(
          userId,
          userId,
          friend.userId
        );

      // Return the updated friend object with latest message, sent, and nickname, or the original friend object
      return latestMessage
        ? {
            ...friend,
            latestMessage: {
              message: latestMessage.message,
              sent: latestMessage.sent,
              sendTime: latestMessage.sendTime,
            },
            yourNickname: nicknames[userId] ? nicknames[userId] : '',
            usersNickName: nicknames[friend.userId]
              ? nicknames[friend.userId]
              : '',
          }
        : friend;
    });

    // Wait for all promises to resolve
    const updatedChats = await Promise.all(promises);
    // Update state with the new data
    setAllChats(updatedChats);
  } catch (error) {
    console.error(
      'Error updating allChats with latest messages and nicknames:',
      error
    );
  }
};
