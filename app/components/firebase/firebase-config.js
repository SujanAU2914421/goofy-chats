// Import the Firebase functions you need
import { getDatabase } from 'firebase/database'; // Use the correct import path
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from '@firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBsOZrD0b0v5_0iE9MZTsg-E0GQTE7qkBA',
  authDomain: 'chatters-c8b64.firebaseapp.com',
  databaseURL: 'https://chatters-c8b64-default-rtdb.firebaseio.com',
  projectId: 'chatters-c8b64',
  storageBucket: 'chatters-c8b64.appspot.com', // Correct storage bucket path
  messagingSenderId: '925058052015',
  appId: '1:925058052015:web:258f98823f409a0d10095a',
  measurementId: 'G-W73K2BWL7L',
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export { firestore };

// Add a new user
async function addUser(userId, name, email) {
  try {
    // Reference to the Firestore collection
    const docRef = await addDoc(collection(firestore, 'users'), {
      userId: userId,
      name: name,
      email: email,
      timestamp: new Date(),
    });

    console.log('User added with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding user: ', e);
  }
}

export { addUser };

export const database = getDatabase(app);
