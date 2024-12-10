import React from 'react';

export default function CurrentChatUiContainer({ currentChatMessages = [] }) {
  if (!currentChatMessages.length) {
    return null; // Render nothing if there are no messages
  }

  // Utility function for computing bubble classes
  const getBubbleClass = (message, index) => {
    const isPreviousMessageDifferentSender =
      index > 0 && currentChatMessages[index - 1].sent !== message.sent;

    const isNextMessageDifferentSender =
      index < currentChatMessages.length - 1 &&
      currentChatMessages[index + 1].sent !== message.sent;

    const isLastMessage = index === currentChatMessages.length - 1;

    // Determine bubble classes
    return `relative max-w-96 text-xs font-mono py-3 px-4 ${
      message.sent
        ? `bg-gray-800 text-white rounded-l-full ${
            isPreviousMessageDifferentSender || index === 0
              ? 'rounded-t-full'
              : ''
          }`
        : `border rounded-r-full ${
            isPreviousMessageDifferentSender || index === 0
              ? 'rounded-t-full'
              : ''
          }`
    } ${
      isLastMessage || isNextMessageDifferentSender ? 'rounded-b-full' : ''
    } ${isPreviousMessageDifferentSender ? 'mt-4' : ''}`;
  };

  return (
    <div className="relative h-auto w-full">
      <div className="relative h-full w-full">
        <div className="relative px-5 pt-4 pb-32">
          {currentChatMessages.map((message, index) => (
            <div
              key={message.id || index} // Prefer a unique id over index
              className={`relative w-full flex ${
                message.sent ? 'justify-end' : ''
              }`}
              aria-label={`Message from ${message.sent ? 'you' : 'them'}`}
            >
              <div className={getBubbleClass(message, index)}>
                {message.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
