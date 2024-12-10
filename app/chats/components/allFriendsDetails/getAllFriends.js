import { getAllFriendsData } from './getAllFriendsDetails';

// Fetch and update user details
export const getAllFriendsDetails = async (
  setLoading,
  setUsersDetails,
  userId
) => {
  try {
    const usersData = await getAllFriendsData(
      setLoading,
      setUsersDetails,
      userId
    );
    setUsersDetails(usersData); // Set merged data
  } catch (error) {
  } finally {
    setLoading(false);
  }
};
