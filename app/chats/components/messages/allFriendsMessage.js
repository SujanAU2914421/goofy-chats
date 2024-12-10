import React, { useEffect, useState } from 'react';

export const AllFriendsMessage = ({
  allChats,
  currentChat,
  setAllChats,
  setCurrentChat,
  getOfflineDuration,
  chatIsLoading,
  setChatIsLoading,
}) => {
  const [currenttime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    // Update `currenttime` every 10 seconds
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 10000); // 10-second interval

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []); // Empty dependency array ensures the interval runs after the first render

  if (chatIsLoading) {
    return '';
  }

  const sortedChats = [...allChats].sort((a, b) => {
    const aMessage = a.latestMessage;
    const bMessage = b.latestMessage;

    if (aMessage && bMessage) {
      return bMessage.sendTime - aMessage.sendTime;
    }

    if (aMessage && !bMessage) return -1;
    if (!aMessage && bMessage) return 1;

    return 0;
  });

  return (
    <div className="relative h-auto w-full pt-2">
      {sortedChats.length > 0 &&
        sortedChats.map((user, index) => {
          const userId = localStorage.getItem('userId');

          if (user.userId === userId) {
            return null; // Exclude current user from the list
          }

          const recentMsg = user.latestMessage || {};
          let messageText = 'Start conversation now!';

          if (recentMsg.message) {
            messageText = recentMsg.sent
              ? `You: ${recentMsg.message}`
              : recentMsg.message;
          }

          return (
            <div key={index} className="relative h-auto w-full pt-3">
              <div
                onClick={() => {
                  setCurrentChat(user);
                  getOfflineDuration(currentChat.lastOnline);
                }}
                className={`relative h-16 px-3 cursor-pointer w-full flex gap-4 items-center ${
                  user.userId !== currentChat?.userId
                    ? 'hover:bg-gray-200 bg-transparent'
                    : 'bg-gray-200'
                } duration-300 rounded-xl`}
              >
                <div className="relative h-12 w-12 rounded-full">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'url(/assets/images/img2.jpg)',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  ></div>
                  {user.online && (
                    <div className="absolute h-4 w-5 right-0 top-0 rounded-full bg-white flex items-center justify-center">
                      <div className="relative h-2 w-2 rounded-full bg-green-600"></div>
                    </div>
                  )}
                </div>

                <div className="relative h-auto w-[calc(100%-4rem)]">
                  <div className="relative w-full flex items-center flex-nowrap gap-2">
                    <div className="relative text-sm font-medium text-gray-800">
                      {user.username}
                    </div>
                  </div>
                  <div className="relative text-xs font-medium text-gray-700 pt-1 flex">
                    <div className="relative max-w-[calc(100%-4rem)] truncate">
                      {messageText}
                    </div>
                    <div className="relative flex items-center w-16 h-auto gap-1 pl-1">
                      <div className="relative h-[1px] w-[3px] bg-gray-600"></div>
                      <div className="relative h-auto w-auto">
                        {recentMsg.sendTime &&
                          (() => {
                            const timeDifferenceInSeconds =
                              currenttime - recentMsg.sendTime / 1000;
                            if (timeDifferenceInSeconds < 60) {
                              return `just now`;
                            } else if (timeDifferenceInSeconds < 3600) {
                              return `${Math.floor(
                                timeDifferenceInSeconds / 60
                              )}m`;
                            } else if (timeDifferenceInSeconds < 86400) {
                              return `${Math.floor(
                                timeDifferenceInSeconds / 3600
                              )}h`;
                            } else {
                              return `${Math.floor(
                                timeDifferenceInSeconds / 86400
                              )}d`;
                            }
                          })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
