import { getUserIdFromLocalStorage } from './handleLocalStorage';

export const checkIfLoggedIn = () => {
  const userId = getUserIdFromLocalStorage();
  if (userId) {
    window.location.pathname = '/chats';
  }
};
