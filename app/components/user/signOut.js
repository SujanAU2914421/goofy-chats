import { setUserOnlineStatus } from '../chats/usersStatus';

export const handleLogout = () => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    setUserOnlineStatus(userId, false); // Mark user as offline on logout
    localStorage.removeItem('userId'); // Optionally remove the user ID after logout
    window.location.pathname = '/chats';
  }
};
