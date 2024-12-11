import React, { useEffect, useState, useMemo } from 'react';
import { deleteMessage } from './deleteMessage';
import { addReactionToMessage } from './messageReaction';

export default function CurrentChatUiContainer({
  currentChatMessages = [],
  currentChat,
  userId,
  messageDeleting,
  setMessageDeleting,
}) {
  const [deletingMessageId, setDeletingMessageId] = useState(null);

  // Ensure the messages are recalculated properly whenever the prop changes
  const messages = useMemo(
    () => [...currentChatMessages],
    [currentChatMessages]
  );

  if (!messages.length) {
    return null; // Render nothing if there are no messages
  }

  // Utility function for computing bubble classes
  const getBubbleClass = (message, index) => {
    const isPreviousMessageDifferentSender =
      index > 0 && messages[index - 1].sent !== message.sent;

    const isNextMessageDifferentSender =
      index < messages.length - 1 && messages[index + 1].sent !== message.sent;

    const isLastMessage = index === messages.length - 1;

    return `relative max-w-96 text-xs font-mono py-4 px-6 ${
      message.sent
        ? `bg-gray-800 text-white rounded-l-[2rem] ${
            isPreviousMessageDifferentSender || index === 0
              ? 'rounded-t-[2rem]'
              : ''
          }`
        : `border rounded-r-[2rem] ${
            isPreviousMessageDifferentSender || index === 0
              ? 'rounded-t-[2rem]'
              : ''
          }`
    } ${isLastMessage || isNextMessageDifferentSender ? 'rounded-b-[2rem]' : ''}`;
  };

  const handleDeleteClick = (messageId, senderId, receiverId) => {
    setMessageDeleting(true);

    deleteMessage(senderId, receiverId, messageId)
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setMessageDeleting(false);
        setDeletingMessageId(null);
      });
  };

  const handleAddReactionClick = (
    senderId,
    receiverId,
    messageId,
    reaction
  ) => {
    addReactionToMessage(senderId, receiverId, messageId, reaction)
      .then(() => {})
      .catch(() => {});
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute h-full w-full flex items-center justify-center"></div>
      <div
        id="currentChatUiContainer"
        className="relative h-full w-full overflow-y-auto"
      >
        <div className="relative h-auto w-full">
          <div className="relative h-full w-full">
            <div className="relative px-5 pt-4 pb-32">
              {messages.map((message, index) => {
                const isPreviousMessageDifferentSender =
                  index > 0 && messages[index - 1].sent !== message.sent;

                return (
                  <div
                    key={message.messageId || index}
                    className={`relative w-full flex ${message.sent ? 'justify-end' : ''}`}
                    aria-label={`Message from ${message.sent ? 'you' : 'them'}`}
                  >
                    <div className="relative h-auto w-auto">
                      <div
                        className={`relative group flex items-center gap-4 ${message.sent ? 'flex-row-reverse' : 'flex-row'} ${
                          isPreviousMessageDifferentSender ? 'mt-4' : ''
                        }`}
                      >
                        <div className={getBubbleClass(message, index)}>
                          <div
                            onClick={() => {
                              setDeletingMessageId('');
                            }}
                            onDoubleClick={() => {
                              handleAddReactionClick(
                                userId,
                                currentChat.userId,
                                message.messageId,
                                '❤️'
                              );
                            }}
                            className="relative h-auto w-auto"
                          >
                            {message.message}
                          </div>
                        </div>
                        <div
                          className={`absolute h-8 w-20 ${!message.sent ? '-right-24' : '-left-24'}`}
                        >
                          <div
                            className={`relative h-full items-center gap-2 flex ${
                              message.sent &&
                              'justify-start flex-row-reverse text-gray-800'
                            }`}
                          >
                            <div className="relative h-full">
                              {deletingMessageId === message.messageId && (
                                <div
                                  className={`absolute z-10 rounded-md bottom-10 cursor-pointer ${
                                    message.sent ? 'right-0' : 'left-0'
                                  } h-8 w-20 bg-red-500 text-white text-xs flex items-center justify-center`}
                                  onClick={() =>
                                    handleDeleteClick(
                                      message.messageId,
                                      userId,
                                      currentChat.userId
                                    )
                                  }
                                >
                                  delete
                                </div>
                              )}

                              <div className="relative h-full flex items-center justify-center">
                                <div
                                  onClick={() =>
                                    setDeletingMessageId(
                                      deletingMessageId !== ''
                                        ? ''
                                        : message.messageId
                                    )
                                  }
                                  className={`relative h-auto w-auto group-hover:flex ${
                                    deletingMessageId === message.messageId
                                      ? 'block'
                                      : 'hidden'
                                  } cursor-pointer`}
                                >
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
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line
                                      x1="10"
                                      y1="11"
                                      x2="10"
                                      y2="17"
                                    ></line>
                                    <line
                                      x1="14"
                                      y1="11"
                                      x2="14"
                                      y2="17"
                                    ></line>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div className="relative h-full flex items-center justify-center">
                              <div
                                onClick={() => {
                                  setDeletingMessageId('');
                                  handleAddReactionClick(
                                    userId,
                                    currentChat.userId,
                                    message.messageId,
                                    '❤️'
                                  );
                                }}
                                className={`relative h-auto w-auto group-hover:flex ${
                                  deletingMessageId === message.messageId
                                    ? 'block'
                                    : 'hidden'
                                } cursor-pointer`}
                              >
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
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {message.reactions && (
                        <div
                          onClick={() => {
                            setDeletingMessageId('');
                            handleAddReactionClick(
                              userId,
                              currentChat.userId,
                              message.messageId,
                              message.reactions[`${userId}`]
                            );
                          }}
                          className="relative h-3 w-full flex cursor-pointer justify-end"
                        >
                          <div className="absolute -top-3 z-10 p-1 text-xs bg-white rounded-full">
                            {message.reactions &&
                              message.reactions[`${userId}`]}
                            {message.reactions &&
                              message.reactions[`${currentChat.userId}`]}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
