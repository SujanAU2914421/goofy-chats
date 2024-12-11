import LoadingBtn from '@/app/components/loadingBtn';
import React, { useEffect, useRef, useState } from 'react';
import { EmojiContainer } from '../emoji';

export default function SendMessageField({
  currentChat,
  sendMessageHandler,
  setMessage,
  message,
  messageSending,
  setMessageSending,
}) {
  // Handles sending the message

  const [emojiBoxShow, setEmojiBoxShow] = useState(false);

  const messageInputFieldRef = useRef(null); // Create a reference to the input field

  useEffect(() => {
    if (!messageSending && messageInputFieldRef.current) {
      messageInputFieldRef.current.focus(); // Focus the input field when messageSending becomes false
    }
  }, []);

  useEffect(() => {
    if (!messageSending && messageInputFieldRef.current) {
      messageInputFieldRef.current.focus(); // Focus the input field when messageSending becomes false
    }
  }, [messageSending]); // Run the effect whenever messageSending changes

  const handleSendMessage = async (event) => {
    setEmojiBoxShow(false);
    event.preventDefault(); // Prevent default form submission

    if (message.trim() && !messageSending) {
      setMessageSending(true); // Disable button and set loading state

      try {
        // Make sure to await the sendMessageHandler to wait for the message to be saved
        await sendMessageHandler();
      } catch (error) {
      } finally {
        setMessageSending(false); // Reset loading state after sending the message
      }
    }
  };

  useEffect(() => {
    setMessage(''); // Reset message input when current chat changes
    if (!messageSending && messageInputFieldRef.current) {
      messageInputFieldRef.current.focus(); // Focus the input field when messageSending becomes false
    }
  }, [currentChat]);

  return (
    <div className="relative h-16 w-full shadow bg-white z-20">
      <form
        onSubmit={handleSendMessage} // Handle the form submission
        className="relative h-full w-full flex items-center"
      >
        {/* Icon Buttons Section */}
        <div className="relative h-auto w-32 px-4 flex items-center justify-between">
          {['camera', 'link', 'microphone'].map((type, index) => (
            <div
              key={type}
              className="relative cursor-pointer text-gray-700 hover:text-gray-800 flex items-center justify-center"
              aria-label={type}
              role="button"
            >
              {/* SVG icons */}
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
                {type === 'camera' && (
                  <>
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </>
                )}
                {type === 'link' && (
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                )}
                {type === 'microphone' && (
                  <>
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </>
                )}
              </svg>
            </div>
          ))}
        </div>

        {/* Input Field */}
        <div className="relative h-auto w-[calc(100%-8rem)] flex items-center">
          <div className="relative h-10 w-full rounded-full border flex">
            {/* Input */}
            <input
              type="text"
              value={message} // Correctly bind the state variable
              ref={messageInputFieldRef} // Attach the reference to the input field
              onChange={(e) => {
                setMessage(e.target.value); // Update the state
              }}
              className="relative h-full w-full outline-none border-none bg-transparent text-sm px-4 font-sans"
              placeholder="Write a message..."
              aria-label="Message input"
              disabled={messageSending} // Disable input when messageSending is true
              autoFocus
            />
            {/* Emoji Icon */}
            <div className="relative w-14 h-full flex items-center justify-center">
              <div
                onClick={() => {
                  setEmojiBoxShow(!emojiBoxShow);
                }}
                className="relative text-gray-700 cursor-pointer hover:text-gray-800"
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
                  aria-label="Emoji"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
            </div>
            {emojiBoxShow && (
              <div className="absolute bottom-12 right-0 h-[20rem] w-[20rem] overflow-hidden rounded-md border bg-white">
                <EmojiContainer
                  message={message}
                  setMessage={setMessage}
                  messageInputFieldRef={messageInputFieldRef}
                  messageSending={messageSending}
                  setMessageSending={setMessageSending}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`relative w-16 h-full flex items-center justify-center text-gray-700 cursor-pointer ${
              !messageSending && message != ''
                ? 'hover:text-gray-800'
                : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={messageSending || message == ''} // Disable button if message is empty or loading
            aria-label="Send"
          >
            {messageSending ? (
              <LoadingBtn />
            ) : (
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
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
