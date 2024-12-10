'use client';
import SideBar from '@/app/components/side-bar';
import React, { useEffect, useState } from 'react';
import { getUserIdFromLocalStorage } from '@/app/components/user/handleLocalStorage';
import { handleLogout } from '@/app/components/user/signOut';
import { removeFriend } from './removeFriend';
import { getUserDetails } from './getUserDetails';
import { editUserBio } from './editBio';
import { fetchFriendsDetails } from '@/app/components/user/getAllFriends';
import { useMainContext } from '@/context/mainContext';
import Link from 'next/link';

export default function ProfileOwn() {
  const [editingBio, setEditingBio] = useState(false);
  const [userBio, setUserBio] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userDetail, setUserDetail] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [tempBio, setTempBio] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [waitMessage, setWaitMessage] = useState(null);

  const [fetchingFriends, setFetchingFriends] = useState(false);

  useEffect(() => {
    const getFriends = async () => {
      if (userId) {
        setFetchingFriends(true);
        try {
          const friendsData = await fetchFriendsDetails(userId);

          setAllFriends(friendsData); // Store the friends data in the state
        } catch (error) {
          console.error('Error fetching friends details:', error);
        }
        setFetchingFriends(false);
      }
    };

    getFriends(); // Call the async function

    const getUser = async () => {
      if (userId) {
        try {
          setLoading(true);
          setWaitMessage('Loading Profile...');
          const userData = await getUserDetails(userId); // Fetch user details
          setLoading(false);
          setWaitMessage('');
          setUserDetail(userData); // Store user details in state
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    getUser(); // Call the async function
  }, [userId]);

  useEffect(() => {
    if (userDetail) {
      setUserBio(userDetail.bio);
    }
  }, [userDetail]);

  const handleUpdateBio = async (userId, tempBio) => {
    try {
      setLoading(true);
      setWaitMessage('Updating Bio please wait...');
      const updatedBio = await editUserBio(tempBio ? tempBio : '', userId);
      setLoading(false);
      setWaitMessage(null);
      setUserBio(updatedBio);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleRemoveFriend = async (userId, friendId) => {
    try {
      setLoading(true);
      setWaitMessage('Removing please wait...');
      const updatedFriendsList = await removeFriend(userId, friendId);
      console.log('Updated friends list:', updatedFriendsList);
      // Optionally, update the state to reflect the change in the UI

      setLoading(false);
      setWaitMessage(null);
      setAllFriends(updatedFriendsList); // Assuming `setFriends` is your state update function
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const bioUpdateHandler = () => {
    handleUpdateBio(userId, tempBio);
  };

  const insertParam = (param, value) => {
    // Get the current URL
    let url = new URL(window.location);

    url.search = ''; // Resets the query string

    // Set or update the parameter
    url.searchParams.set(param, value);

    // Update the browser's URL without reloading
    window.history.replaceState({}, '', url);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      window.location.pathname = '/login';
      // Proceed with user-specific actions
    } else {
      setUserId(storedUserId);
      insertParam('user_id', storedUserId);
    }
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans flex">
      <div className="relative h-full w-16 bg-gray-800 duration-300 left-0 shadow-md shadow-gray-700">
        <SideBar />
      </div>
      <div className="relative h-full w-full">
        {loading && (
          <div className="fixed z-20 bg-white/40 h-full w-full flex items-center justify-center">
            <div className="relative">{waitMessage}</div>
          </div>
        )}
        <div className="relative flex w-full h-full justify-center">
          <div className="relative h-full w-auto">
            <div className="relative h-full w-[40rem] overflow-y-auto border-l border-r pt-8 pb-8 px-8">
              <div className="relative h-auto w-full">
                <div className="relative flex items-center justify-between">
                  <div
                    onClick={() => {
                      window.location.pathname = '/chats';
                    }}
                    className="relative h-auto flex items-center gap-3 text-gray-700 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center group-hover:-translate-x-1 duration-200">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                    </div>
                    <div className="relative text-sm font-bold">Back</div>
                  </div>
                  <div className="relative">
                    <div
                      onClick={() => {
                        setLoggingOut(true);
                      }}
                      className="relative h-8 w-36 rounded border border-red-600 hover:border-none hover:bg-red-500 hover:text-white cursor-pointer flex items-center justify-center text-xs font-bold text-red-600"
                    >
                      Log Out?
                    </div>
                    {loggingOut && (
                      <div className="fixed bg-black/10 z-20 h-screen w-screen overflow-hidden top-0 left-0">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="relative bg-white w-[40rem] py-5 rounded">
                            <div className="relative flex justify-between items-center">
                              <div className="relative text-sm font-bold text-gray-700 px-8">
                                Do you really want to logout?
                              </div>
                              <div className="relative flex items-center gap-4 pr-4">
                                <div
                                  onClick={() => {
                                    setLoggingOut(false);
                                  }}
                                  className="relative h-8 w-16 rounded cursor-pointer duration-200 hover:bg-green-500 hover:text-white hover:border-none border border-green-500 text-green-500 flex items-center justify-center gap-2"
                                >
                                  <div className="relative text-xs">No</div>
                                  <div className="relative flex items-center justify-center">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <line
                                        x1="18"
                                        y1="6"
                                        x2="6"
                                        y2="18"
                                      ></line>
                                      <line
                                        x1="6"
                                        y1="6"
                                        x2="18"
                                        y2="18"
                                      ></line>
                                    </svg>
                                  </div>
                                </div>
                                <div
                                  onClick={() => {
                                    handleLogout();
                                  }}
                                  className="relative h-8 w-16 rounded cursor-pointer duration-200 hover:bg-red-500 hover:text-white hover:border-none border border-red-500 text-red-500 flex items-center justify-center gap-2"
                                >
                                  <div className="relative text-xs">Yes</div>
                                  <div className="relative flex items-center justify-center">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative h-auto w-full pt-8">
                  <div className="relative">
                    <div className="relative text-4xl font-extrabold text-gray-600 font-mono">
                      {userDetail.username}
                    </div>
                    <div className="relative w-full pt-8">
                      {editingBio ? (
                        <div className="relative h-auto w-full">
                          <div className="relative h-auto w-full border">
                            <textarea
                              id="userBioInputField"
                              defaultValue={userBio}
                              className="relative h-16 max-h-40  min-h-14 w-full px-3 py-3 text-xs font-mono outline-none"
                              cols="30"
                              onChange={(e) => {
                                setTempBio(e.target.value);
                              }}
                              rows="10"
                              maxLength={200}
                            ></textarea>
                          </div>
                        </div>
                      ) : (
                        <div className="relative text-xs w-3/4 leading-5 font-bold text-gray-600 font-mono">
                          {userBio && userBio.length > 0
                            ? userBio
                            : 'Short Bio about yourself!'}
                        </div>
                      )}
                      <div className="relative flex w-full">
                        {editingBio ? (
                          <div className="relative flex w-full justify-between">
                            <div
                              onClick={() => {
                                setEditingBio(false);
                              }}
                              className="relative pt-2 text-xs font-bold text-gray-700 hover:underline cursor-pointer"
                            >
                              Discard edit
                            </div>
                            <div
                              onClick={() => {
                                setEditingBio(false);
                                bioUpdateHandler();
                              }}
                              className="relative pt-2 text-xs font-bold text-gray-700 hover:underline cursor-pointer"
                            >
                              Save changes?
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingBio(true);
                            }}
                            className="relative pt-2 flex items-center text-xs font-bold text-gray-700 gap-2 hover:underline cursor-pointer"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                            edit?
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative pt-8 w-full">
                      <div className="relative flex items-center justify-between">
                        <div className="relative flex items-center gap-2">
                          <div className="relative text-xs font-bold text-gray-600">
                            Friends
                          </div>

                          <div className="relative h-auto w-auto flex items-center gap-2">
                            <div className="relative flex items-center gap-1 text-gray-600">
                              <div className="relative text-xs font-semibold">
                                a - z
                              </div>
                              <div className="relative h-auto w-auto flex items-center justify-center">
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="relative flex items-center gap-4">
                            <div className="relative h-8 w-40 rounded border flex items-center justify-center">
                              <input
                                type="text"
                                placeholder="Search friend?"
                                className="relative h-full w-full px-4 bg-transparent text-xs outline-none border-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative h-auto w-full pt-4 grid gap-3">
                        {!fetchingFriends ? (
                          allFriends && allFriends.length > 0 ? (
                            allFriends.map((friend, index) => (
                              <div
                                key={index}
                                className="relative w-96 flex justify-between py-4 px-4 group border border-gray-200 hover:border-gray-400 duration-200 rounded-md"
                              >
                                <div className="relative grid gap-1">
                                  <div className="relative h-auto text-sm font-bold text-gray-700">
                                    {friend.username}
                                  </div>
                                  <div className="relative h-auto text-xs text-gray-500">
                                    No mutual friends
                                  </div>
                                  <div className="relative h-auto w-auto flex mt-4">
                                    <div
                                      onClick={() => {
                                        const params = new URLSearchParams({
                                          user_id: friend.userId,
                                        });
                                        const url =
                                          '/profile?' + params.toString();
                                        window.location = url;
                                      }}
                                      className="relative hover:underline text-xs text-gray-600 font-bold cursor-pointer hover:text-gray-800"
                                    >
                                      View Profile?
                                    </div>
                                  </div>
                                </div>
                                <div
                                  onClick={() => {
                                    handleRemoveFriend(userId, friend.userId);
                                  }}
                                  className="relative flex font-medium h-8 w-28 rounded-md hover:bg-red-400 hover:text-white cursor-pointer text-[0.7rem] items-center justify-center"
                                >
                                  Remove friend
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="relative">
                              <div className="relative text-sm font-bold text-gray-700">
                                You dont have any friends
                              </div>
                              <div className="relative pt-4">
                                <Link
                                  href={`/find-people`}
                                  className="relative cursor-pointer text-xs rounded flex items-center justify-center h-8 w-32 bg-gray-700 text-white"
                                >
                                  Add friends now?
                                </Link>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="relative text-sm font-bold text-gray-700">
                            Loading Friends
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
