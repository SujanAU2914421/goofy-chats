import {
  getDatabase,
  ref,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
  onValue,
} from 'firebase/database';
import { fetchMessages } from './fetchAllCurrentChat';
import { updateAllChatsWithLatestMessages } from './fetchAllFriendsLatestChat';

// Function to fetch messages and nicknames, and update chat list in real-time
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

  // References for messages and nicknames
  const messagesRef1 = ref(db, `messages/${conversationKey1}/messages`);
  const messagesRef2 = ref(db, `messages/${conversationKey2}/messages`);
  const nicknamesRef1 = ref(db, `messages/${conversationKey1}/nicknames`);
  const nicknamesRef2 = ref(db, `messages/${conversationKey2}/nicknames`);

  try {
    // Step 1: Fetch all messages initially
    fetchMessages(userId, currentChatUserId, setCurrentChatMessages);

    // Step 2: Listen for real-time changes in messages
    const handleChildAdded = async (snapshot) => {
      const message = snapshot.val();
      if (!message) return;

      // Fetch the current chat messages after a new message is added
      fetchMessages(userId, currentChatUserId, setCurrentChatMessages);

      // Update the latest messages and nicknames in allChats
      await updateAllChatsWithLatestMessages(userId, allChats, setAllChats);
    };

    const handleChildChanged = async (snapshot) => {
      const message = snapshot.val();
      if (!message) return;

      // Fetch the current chat messages after a message is changed
      fetchMessages(userId, currentChatUserId, setCurrentChatMessages);

      // Update the latest messages and nicknames in allChats
      await updateAllChatsWithLatestMessages(userId, allChats, setAllChats);
    };

    const handleChildRemoved = async (snapshot) => {
      const message = snapshot.val();
      if (!message) return;

      // Fetch the current chat messages after a message is removed
      fetchMessages(userId, currentChatUserId, setCurrentChatMessages);

      // Update the latest messages and nicknames in allChats
      await updateAllChatsWithLatestMessages(userId, allChats, setAllChats);
    };

    // Step 3: Attach real-time listeners for messages
    onChildAdded(messagesRef1, handleChildAdded);
    onChildChanged(messagesRef1, handleChildChanged);
    onChildRemoved(messagesRef1, handleChildRemoved);

    onChildAdded(messagesRef2, handleChildAdded);
    onChildChanged(messagesRef2, handleChildChanged);
    onChildRemoved(messagesRef2, handleChildRemoved);

    // Step 4: Add onValue to listen for changes to the entire messages collection
    const handleMessagesChange = (snapshot) => {
      const allMessages = snapshot.val();
      if (!allMessages) return;

      // Fetch all messages when the entire messages collection changes
      fetchMessages(userId, currentChatUserId, setCurrentChatMessages);

      // Update the latest messages and nicknames in allChats
      updateAllChatsWithLatestMessages(userId, allChats, setAllChats);
    };

    onValue(messagesRef1, handleMessagesChange);
    onValue(messagesRef2, handleMessagesChange);

    // Step 5: Listen for real-time changes in nicknames
    const handleNicknameChange = async () => {
      // Update nicknames in allChats whenever a nickname changes
      await updateAllChatsWithLatestMessages(userId, allChats, setAllChats);
    };

    onChildAdded(nicknamesRef1, handleNicknameChange);
    onChildChanged(nicknamesRef1, handleNicknameChange);
    onChildRemoved(nicknamesRef1, handleNicknameChange);

    onChildAdded(nicknamesRef2, handleNicknameChange);
    onChildChanged(nicknamesRef2, handleNicknameChange);
    onChildRemoved(nicknamesRef2, handleNicknameChange);

    // Step 6: Cleanup listeners when no longer needed
    return () => {
      off(messagesRef1, 'child_added', handleChildAdded);
      off(messagesRef1, 'child_changed', handleChildChanged);
      off(messagesRef1, 'child_removed', handleChildRemoved);

      off(messagesRef2, 'child_added', handleChildAdded);
      off(messagesRef2, 'child_changed', handleChildChanged);
      off(messagesRef2, 'child_removed', handleChildRemoved);

      off(nicknamesRef1, 'child_added', handleNicknameChange);
      off(nicknamesRef1, 'child_changed', handleNicknameChange);
      off(nicknamesRef1, 'child_removed', handleNicknameChange);

      off(nicknamesRef2, 'child_added', handleNicknameChange);
      off(nicknamesRef2, 'child_changed', handleNicknameChange);
      off(nicknamesRef2, 'child_removed', handleNicknameChange);

      off(messagesRef1, 'value', handleMessagesChange); // Cleanup the onValue listener
      off(messagesRef2, 'value', handleMessagesChange); // Cleanup the onValue listener
    };
  } catch (error) {
    console.error('Error in listenForMessageAndNicknameChanges:', error);
    setCurrentChatMessages([]); // Handle error gracefully by setting empty state
  }
};
