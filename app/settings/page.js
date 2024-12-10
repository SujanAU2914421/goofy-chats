import {
  addUser,
  database,
  firestore,
} from '@/app/components/firebase/firebase-config';
import { ref, set, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions

// Writing data
function writeMessage(chatId, message) {
  const chatRef = ref(database, `chats/${chatId}`);
  set(chatRef, {
    message,
    timestamp: Date.now(),
  })
    .then(() => {
      console.log('Message saved successfully!');
    })
    .catch((error) => {
      console.error('Error saving message:', error);
    });
}

// Reading data (real-time updates)
function listenForMessages(chatId) {
  const chatRef = ref(database, `chats/${chatId}`);
  onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    console.log('New message:', data);
  });
}

// Add a user

async function fetchUserById(userId) {
  console.log('fetching');

  const userDocRef = doc(firestore, 'users', userId); // Reference to the user's document
  try {
    const docSnap = await getDoc(userDocRef); // Get the document
    if (docSnap.exists()) {
      console.log('User data:', docSnap.data()); // Logs user data
    } else {
      console.log('No such user!');
    }
  } catch (error) {
    console.error('Error fetching user: ', error);
  }
}

// Example: Fetch user with ID "user123"

export default function SaveMessage() {
  fetchUserById('72WTHNkxyTYM7hWmszWK');
  // addUser("user123", "Sujan Limbu", "sujan@example.com");
  return <div>SaveMessage</div>;
}
