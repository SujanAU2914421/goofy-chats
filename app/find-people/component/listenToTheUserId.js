import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/app/components/firebase/firebase-config'; // Make sure this is the correct path

export const useUsersListener = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the `users` collection
    const usersCollection = collection(firestore, 'users');

    // Real-time listener for the collection
    const unsubscribe = onSnapshot(
      usersCollection,
      (querySnapshot) => {
        const usersList = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          // Destructure and remove password and email from user data
          const { password, email, ...rest } = userData;
          usersList.push({ userId: doc.id, ...rest });
        });

        setUsers(usersList); // Update state with real-time data
        setLoading(false); // Stop loading once the data is fetched
      },
      (error) => {
        console.error('Error listening to Firestore: ', error);
        setLoading(false); // Stop loading in case of an error
      }
    );

    // Cleanup listener when the component is unmounted
    return () => unsubscribe();
  }, []); // Empty dependency array to only set up the listener once on mount

  return { users, loading }; // Return both users and loading state
};
