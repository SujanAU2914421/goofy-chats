import { getAllUserDetails } from './userFunctions';

// Fetch and update user details
export const updateUserDetails = async (setLoading, setUsersDetails) => {
  try {
    const usersData = await getAllUserDetails();
    setUsersDetails(usersData); // Set merged data
  } catch (error) {
    console.error('Error fetching user details:', error);
  } finally {
    setLoading(false);
  }
};
