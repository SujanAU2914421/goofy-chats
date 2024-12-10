export const checkUserStatus = (user, currentUser) => {
  if (!currentUser) {
    return null;
  }

  // Check if the specific user is in the current user's friends list
  const isFriend =
    currentUser.friends &&
    currentUser.friends.some((friend) => friend.userId === user.userId);

  // Check if the current user is in the specific user's friends list (mutual friendship check)
  const isFriendOfCurrentUser = user.friends?.some(
    (friend) => friend.userId === currentUser.userId
  );

  // Check if the specific user is in the current user's blocked list
  const isBlocked =
    currentUser.blocked &&
    currentUser.blocked.some(
      (blockedUser) => blockedUser.userId === user.userId
    );

  // Blocked user - unblock
  if (isBlocked) return 'unblock';

  // If both users are friends, return 'remove' option
  if (isFriend && isFriendOfCurrentUser) return 'remove'; // Both users are friends

  // If the current user has the specific user in their friends list but the user has not reciprocated, return 'sent request'
  if (isFriend && !isFriendOfCurrentUser) return 'requestSent';

  // If the specific user has the current user in their friends list but the current user hasn't reciprocated, return 'acceptRequest'
  if (!isFriend && isFriendOfCurrentUser) return 'acceptRequest';

  // If neither friend nor mutual friend, suggest adding as friend
  return 'add';
};
