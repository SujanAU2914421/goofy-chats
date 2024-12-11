'use client';
// ./page.js
import React, { useState, useEffect } from 'react';
import {
  fetchPresenceData,
  listenForUserChanges,
} from './components/presenceFunctions';
import { useMainContext } from '@/context/mainContext';
import SideBar from '@/app/components/side-bar';
import { updateUserStatus } from './components/setUserStatus';
import { saveMessage } from './components/messages/sendMessage';
import CurrentChatSettings from '@/app/components/current-chat-settings';
import CurrentChatUiContainer from './components/messages/currentChatUiContainer';
import SendMessageFIeld from './components/messages/sendMessageFIeld';
import { updateUserDetails } from './components/updateAllUsersDetails';
import { AllFriendsMessage } from './components/messages/allFriendsMessage';
import { listenForMessageChangesAndFetch } from './components/messages/currentChatListner';
import Link from 'next/link';
import { getAllFriendsDetails } from './components/allFriendsDetails/getAllFriends';
import { updateAllChatsWithLatestMessages } from './components/messages/fetchAllFriendsLatestChat';
import { getUserDetails } from '../profile/components/getUserDetails';
import LoadingBtn from '../components/loadingBtn';

const Page = () => {
  const {
    allUsersStatus,
    setAllUsersStatus,
    usersDetails,
    setUsersDetails,
    loading,
    setLoading,
    messageSending,
    setMessageSending,
    messageDeleting,
    setMessageDeleting,
  } = useMainContext(); // Assuming you have this context for global status updates
  const [currentChat, setCurrentChat] = useState(null); // Stores the currently selected user for the chat
  const [message, setMessage] = useState(''); // Message state for chat
  const [showChatSettingContent, setShowChatSettingContent] = useState(false); // For chat settings
  const [userId, setUserId] = useState(null); // Declare userId state

  const [currentChatMessages, setCurrentChatMessages] = useState([]);

  const [currentChatLastOnlineInSeconds, setCurrentChatLastOnlineInSeconds] =
    useState(undefined);
  const [currentChatLastOnlineInTime, setCurrentChatLastOnlineInTime] =
    useState('');

  const [loadingFriendsDetails, setLoadingFriendsDetails] = useState(true);

  const [chatIsLoading, setChatIsLoading] = useState(true);

  const [allChats, setAllChats] = useState(null);

  function getOfflineDuration() {
    const lastOnline = currentChat.lastOnline;
    if (lastOnline === undefined) {
      return undefined; // User is online
    }

    // Convert lastOnline (timestamp in milliseconds) to seconds
    const lastOnlineInSeconds = lastOnline / 1000;

    // Get the current time in seconds
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    // Calculate the difference
    const timeDifference = currentTimeInSeconds - lastOnlineInSeconds;

    setCurrentChatLastOnlineInSeconds(timeDifference);
  }

  // Assuming currentChat is available in scope and has a `lastOnline` property
  setInterval(() => {
    if (currentChat != [] && currentChat != null) {
      getOfflineDuration();
    }
  }, 10000); // Interval of 10 seconds (10000 milliseconds)

  useEffect(() => {
    if (!loading && allChats != null && allChats != []) {
      // Check if currentChat is not set (e.g., null or undefined)
      if (!currentChat || Object.keys(currentChat).length === 0) {
        // Set the initial chat to the first chat that's not the user's own chat
        const initialChat =
          allChats[0].userId === userId ? allChats[1] : allChats[0];
        if (initialChat) {
          setCurrentChat(initialChat);
        }
      }
    }
  }, [loading, allChats, currentChat]);

  useEffect(() => {
    if (usersDetails && usersDetails.length > 0 && userId) {
      // Set allChats with userDetails initially
      setAllChats(usersDetails);

      // Fetch the most recent messages for each friend
      const fetchMessages = async () => {
        try {
          setChatIsLoading(true); // Start loading
          await updateAllChatsWithLatestMessages(
            userId,
            usersDetails,
            setAllChats
          );
        } catch (error) {
        } finally {
          setChatIsLoading(false); // Stop loading
        }
      };

      fetchMessages();
    }
  }, [usersDetails, userId]);

  const sendMessageHandler = async () => {
    const trimmedMessage = message.trim();

    if (trimmedMessage !== '') {
      await saveMessage(userId, currentChat.userId, trimmedMessage); // Send the message
      setMessage(''); // Clear the message state
    }
  };

  useEffect(() => {
    if (currentChat && userId) {
      console.log(currentChat);

      getOfflineDuration();
      // Fetch all messages and start listening for changes in real-time
      const cleanupListeners = listenForMessageChangesAndFetch(
        userId,
        currentChat.userId,
        setCurrentChatMessages,
        allChats,
        setAllChats
      );

      // Cleanup listeners when the component unmounts or dependencies change
      return cleanupListeners;
    }
  }, [currentChat]);

  useEffect(() => {
    if (!loading && allChats != null && allChats != []) {
      if (currentChat.lastOnline && currentChat.lastOnline !== 0) {
        let tempTime = 'just now';
        const minutes = Math.floor(currentChatLastOnlineInSeconds / 60);

        if (minutes > 0) {
          tempTime = `${minutes}m`;

          const hours = Math.floor(minutes / 60);
          if (hours > 0) {
            tempTime = `${hours}h`;

            const days = Math.floor(hours / 24);
            if (days > 0) {
              tempTime = `${days}day`;
            }
          }
        }
        setCurrentChatLastOnlineInTime(tempTime);
      } else {
        setCurrentChatLastOnlineInTime('');
      }
    }
  }, [currentChatLastOnlineInSeconds]);

  const scrollToBottom = () => {
    const container = document.getElementById('currentChatUiContainer');
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0); // Allow DOM updates before scrolling
    } else {
      console.warn("Container with ID 'currentChatUiContainer' not found.");
    }
  };

  useEffect(() => {
    console.log(currentChatMessages);
  }, [currentChatMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChatMessages]);

  const updateUserData = async () => {
    setLoadingFriendsDetails(true);
    try {
      await getAllFriendsDetails(setLoading, setUsersDetails, userId);
    } catch (error) {
    } finally {
      setLoadingFriendsDetails(false);
    }
  };

  useEffect(() => {
    if (userId) {
      updateUserStatus();
      updateUserData();
      getUserDetails(userId);
    }
  }, [userId]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId) {
      setUserId(storedUserId); // Set userId to the stored value
    } else {
      window.location.pathname = '/login'; // Redirect to login if no userId
    }

    const unsubscribeUserChanges = fetchPresenceData(setAllUsersStatus);
    const unsubscribeUserChange = listenForUserChanges(setUsersDetails);

    return () => {
      unsubscribeUserChanges();
      unsubscribeUserChange();
    };
  }, []);

  // Listen for presence changes and update user details if the data changes
  const handlePresenceUpdate = (newPresenceData) => {
    // Only call updateUserDetails if the presence data changes
    if (newPresenceData) {
      updateUserDetails(); // This function will fetch updated user details
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans">
      {usersDetails != [] && userId != '' && allUsersStatus != [] ? (
        <div className="relative flex h-full w-full bg-gradient-to-r from-gray-50 to-white">
          <div
            id="sideBarContainer"
            className="relative z-40 h-full w-16 bg-gray-800 duration-300 left-0 shadow-md shadow-gray-700"
          >
            <SideBar />
          </div>
          <div className="relative h-full w-full">
            <div className="relative h-full w-full flex">
              <div className="relative h-full w-[24rem] flex">
                <div className="relative h-full w-full">
                  <div className="relative h-full w-full flex">
                    <div className="relative h-full w-full px-4">
                      <div
                        className="relative text-3xl h-32 flex items-center"
                        style={{ fontFamily: 'GreatVibes' }}
                      >
                        <div className="relative">Chatters</div>
                      </div>
                      <div className="relative px-2 text-normal font-bold">
                        Messages
                      </div>
                      {!loadingFriendsDetails ? (
                        allChats ? (
                          <AllFriendsMessage
                            allChats={allChats}
                            currentChat={currentChat}
                            setAllChats={setAllChats}
                            setCurrentChat={setCurrentChat}
                            getOfflineDuration={getOfflineDuration}
                            chatIsLoading={chatIsLoading}
                            setChatIsLoading={setChatIsLoading}
                          />
                        ) : (
                          <div className="relative px-2 pt-8">
                            <div className="relative text-sm">
                              No any conversation
                            </div>
                            <div className="relative flex pt-4">
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
                        <div className="relative pt-8 pl-8">
                          <LoadingBtn />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-full w-[calc(100%-24rem)] pt-8 flex">
                {currentChat != [] && currentChat != null ? (
                  <div className="relative h-full w-full">
                    <div className="relative h-16 w-full">
                      <div className="relative h-full w-full flex justify-between items-center">
                        <div className="relative h-auto w-auto flex gap-4">
                          <div className="relative h-auto w-auto">
                            <div
                              className="relative h-12 w-12 rounded-full"
                              style={{
                                background:
                                  'url(/assets/images/loginpageimg.jpg)',
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                              }}
                            ></div>
                            {currentChat.online && (
                              <div className="absolute h-4 w-5 right-0 top-0 rounded-full bg-white flex items-center justify-center">
                                <div className="relative h-2 w-2 rounded-full bg-green-600"></div>
                              </div>
                            )}
                          </div>
                          <div className="relative h-auto w-auto">
                            <div className="relative h-auto w-auto">
                              <div className="relative text-sm font-bold text-gray-800">
                                {currentChat.usersNickName
                                  ? currentChat.usersNickName
                                  : currentChat.username}
                              </div>
                              <div className="relative text-xs font-light text-gray-600 pt-1">
                                {currentChatLastOnlineInTime != ''
                                  ? currentChatLastOnlineInTime
                                  : 'Active now'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative h-auto w-32">
                          <div className="relative h-auto w-full flex items-center justify-end">
                            <div className="relative w-[calc(100%-2.5rem)] flex items-center justify-end pr-4">
                              <div className="relative w-10 flex items-center justify-center">
                                <div className="relative h-auto w-auto hover:text-gray-800 text-gray-600 cursor-pointer">
                                  <svg
                                    width="17"
                                    height="17"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                  </svg>
                                </div>
                              </div>
                              <div className="relative w-10 flex items-center justify-center">
                                <div className="relative h-auto w-auto hover:text-gray-800 text-gray-600 cursor-pointer">
                                  <svg
                                    width="17"
                                    height="17"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                    <rect
                                      x="1"
                                      y="5"
                                      width="15"
                                      height="14"
                                      rx="2"
                                      ry="2"
                                    ></rect>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div
                              onClick={() => {
                                setShowChatSettingContent(
                                  !showChatSettingContent
                                );
                              }}
                              className="relative w-10 flex items-center text-gray-500 hover:text-gray-800 justify-center pr-5 cursor-pointer"
                            >
                              {!showChatSettingContent ? (
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="4" y1="21" x2="4" y2="14"></line>
                                  <line x1="4" y1="10" x2="4" y2="3"></line>
                                  <line x1="12" y1="21" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12" y2="3"></line>
                                  <line x1="20" y1="21" x2="20" y2="16"></line>
                                  <line x1="20" y1="12" x2="20" y2="3"></line>
                                  <line x1="1" y1="14" x2="7" y2="14"></line>
                                  <line x1="9" y1="8" x2="15" y2="8"></line>
                                  <line x1="17" y1="16" x2="23" y2="16"></line>
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-[calc(100%-4rem)] w-full pt-2">
                      <div className="relative h-full w-full border-t border-l border-r">
                        <div className="relative h-[calc(100%-4rem)] w-full">
                          {currentChatMessages && (
                            <CurrentChatUiContainer
                              currentChatMessages={currentChatMessages}
                              currentChat={currentChat}
                              userId={userId}
                              messageDeleting={messageDeleting}
                              setMessageDeleting={setMessageDeleting}
                            />
                          )}
                        </div>
                        <SendMessageFIeld
                          currentChat={currentChat}
                          sendMessageHandler={sendMessageHandler}
                          setMessage={setMessage}
                          message={message}
                          messageSending={messageSending}
                          setMessageSending={setMessageSending}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative px-2 pt-8">
                    <div className="relative text-sm">No any conversation</div>
                  </div>
                )}
                {showChatSettingContent && (
                  <CurrentChatSettings
                    currentChat={currentChat}
                    userDetail={usersDetails.find(
                      (user) => user.userId === userId
                    )}
                    setUsersDetails={setUsersDetails}
                    setLoading={setLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-full w-full flex items-center justify-center">
          <LoadingBtn />
        </div>
      )}
    </div>
  );
};

export default Page;
