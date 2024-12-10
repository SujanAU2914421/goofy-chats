export const getUserIdFromLocalStorage = () => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    return userId; // Return the user ID if found
  } else {
    return null; // Return null if no user is found in localStorage
  }
};
