import {
  getDatabase,
  ref,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
} from 'firebase/database';
import { fetchMessages } from './fetchAllCurrentChat';
import { updateAllChatsWithLatestMessages } from './fetchAllFriendsLatestChat';

// Function to fetch messages and update chat list in real-time
export const listenForMessageChangesAndFetch = (
  userId,
  currentChatUserId,
  setCurrentChatMessages,
  allChats,
  setAllChats
) => {
  const db = getDatabase();

  // Dynamically create the conversation reference between userId and currentChatUserId
  const conversationKey1 = `${userId}_${currentChatUserId}`;
  const conversationKey2 = `${currentChatUserId}_${userId}`;

  // Reference for the conversation node
  const messagesRef1 = ref(db, `messages/${conversationKey1}/messages`);
  const messagesRef2 = ref(db, `messages/${conversationKey2}/messages`);

  try {
    // Step 1: Fetch all messages initially
    fetchMessages(userId, currentChatUserId, setCurrentChatMessages);

    // Step 2: Listen for real-time changes in messages
    const handleChildAdded = async (snapshot) => {
      const message = snapshot.val();
      if (!message) return;

      // Fetch the current chat messages after a new message is added
      fetchMessages(userId, currentChatUserId, setCurrentChatMessages);

      // Update the latest messages in allChats
      await updateAllChatsWithLatestMessages(userId, allChats, setAllChats);
    };

    const handleChildChanged = async (snapshot) => {
      const message = snapshot.val();
      if (!message) return;

      // Fetch the current chat messages after a message is changed
      fetchMessages(userId, currentChatUserId, setCurrentChatMessages);

      // Update the latest messages in allChats
      await updateAllChatsWithLatestMessages(userId, allChats, setAllChats);
    };

    const handleChildRemoved = async (snapshot) => {
      const message = snapshot.val();
      if (!message) return;

      // Fetch the current chat messages after a message is removed
      fetchMessages(userId, currentChatUserId, setCurrentChatMessages);

      // Update the latest messages in allChats
      await updateAllChatsWithLatestMessages(userId, allChats, setAllChats);
    };

    // Step 3: Attach real-time listeners for new, changed, and removed messages
    onChildAdded(messagesRef1, handleChildAdded);
    onChildChanged(messagesRef1, handleChildChanged);
    onChildRemoved(messagesRef1, handleChildRemoved);

    // If no messages exist under the first key, try the second key
    onChildAdded(messagesRef2, handleChildAdded);
    onChildChanged(messagesRef2, handleChildChanged);
    onChildRemoved(messagesRef2, handleChildRemoved);

    // Step 4: Cleanup listeners when no longer needed
    return () => {
      off(messagesRef1, 'child_added', handleChildAdded);
      off(messagesRef1, 'child_changed', handleChildChanged);
      off(messagesRef1, 'child_removed', handleChildRemoved);

      off(messagesRef2, 'child_added', handleChildAdded);
      off(messagesRef2, 'child_changed', handleChildChanged);
      off(messagesRef2, 'child_removed', handleChildRemoved);
    };
  } catch (error) {
    console.error('Error in listenForMessageChangesAndFetch:', error);
    setCurrentChatMessages([]); // Handle error gracefully by setting empty state
  }
};
