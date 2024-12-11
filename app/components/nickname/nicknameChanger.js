import { ref, get, update } from 'firebase/database';
import { database } from '../firebase/firebase-config';

export const updateNicknames = async (
  userId,
  friendId,
  nickname,
  targetUserId
) => {
  const docId1 = `${userId}_${friendId}`;
  const docId2 = `${friendId}_${userId}`;
  let documentRef = ref(database, 'messages/' + docId1);

  try {
    // Try to get data from the first possible document ID
    let snapshot = await get(documentRef);

    // If the first document doesn't exist, check the second one
    if (!snapshot.exists()) {
      documentRef = ref(database, 'messages/' + docId2);
      snapshot = await get(documentRef);
    }

    // If neither document exists, create the new document with the first ID
    if (!snapshot.exists()) {
      const nicknames = {
        [userId]: nickname || '', // Handle empty nickname
        [friendId]: nickname || '', // Handle empty nickname
      };

      // Create new document with nicknames field
      await update(documentRef, { nicknames });
      return;
    }

    // Document exists, check for the nicknames field and initialize it if needed
    let nicknames = snapshot.val().nicknames || {};

    // If there are no nicknames field, initialize it as an empty object
    if (!snapshot.val().hasOwnProperty('nicknames')) {
      nicknames = {};
    }

    // Update the nickname for the target user
    if (targetUserId === userId) {
      nicknames[userId] = nickname || ''; // Handle empty nickname
    } else if (targetUserId === friendId) {
      nicknames[friendId] = nickname || ''; // Handle empty nickname
    } else {
    }

    // Save the updated nicknames
    await update(documentRef, { nicknames });
  } catch (error) {}
};
