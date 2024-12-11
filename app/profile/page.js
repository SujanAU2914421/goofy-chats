'use client';
import { useEffect, useState } from 'react';
import { getUserIdFromLocalStorage } from '../components/user/handleLocalStorage';
import { getUserDetails } from './components/getUserDetails';
import ProfileOwn from './components/ownProfile';
import OthersProfile from './components/othersProfile';
import NoUserFound from './components/noUserFound';

export default function Profile() {
  const [givenUid, setGivenUid] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (givenUid && givenUid.length == 20) {
      getUserDetails(givenUid);
    }
  }, [givenUid]);

  useEffect(() => {
    const url = new URL(window.location.href); // Or use a specific URL
    // Get query parameters using URLSearchParams
    const params = new URLSearchParams(url.search);

    setUserId(getUserIdFromLocalStorage());

    setGivenUid(params.get('user_id'));

    const userIdT = getUserIdFromLocalStorage();

    if (!userIdT) {
      url.search = ''; // Resets the query string

      window.history.replaceState({}, '', url);

      window.location.pathname = '/login';
      // Proceed with user-specific actions
    }

    setLoading(false);
  }, []);

  if (!loading) {
    if (givenUid) {
      if (givenUid == userId) {
        return <ProfileOwn />;
      } else if (givenUid.length == 20 && givenUid != '') {
        return <OthersProfile />;
      } else {
        return <NoUserFound />;
      }
    } else {
      if (givenUid == '') {
        return <NoUserFound />;
      } else {
        return <ProfileOwn />;
      }
    }
  }
}
