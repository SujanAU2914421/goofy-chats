import React from 'react';

export const EmojiContainer = ({ message, setMessage }) => {
  const emojis =
    '😀😃😄😁😆😅😂🤣🥲🥹☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥸🤩🥳🙂‍↕️😏😒🙂‍↔️😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😮‍💨😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🫣🤗🫡🤔🫢🤭🤫🤥😶😶‍🌫️😐😑😬🫨🫠🙄😯😦😧😮😲🥱😴🤤😪😵😵‍💫🫥🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀☠️👽👾🤖🎃😺😸😹😻😼😽🙀😿😾';

  const emojiArray = [...emojis]; // Spread the string into an array of characters

  return (
    <div className="relative h-full w-full overflow-y-auto">
      <div className="relative w-full h-auto px-4 pt-4 pb-16">
        <div className="relative w-full h-auto flex flex-wrap">
          {emojiArray.map((emoji, index) => (
            <div
              key={index}
              className="relative h-auto w-1/6 text-2xl flex items-center justify-center"
            >
              <div
                onClick={() => {
                  setMessage(message + emoji);
                }}
                className="relative hover:bg-gray-200 cursor-pointer"
              >
                {emoji}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
