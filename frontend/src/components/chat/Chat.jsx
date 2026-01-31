import React from "react";
import { BsSendCheck } from "react-icons/bs";
import { UserData } from "../../context/UserContext";

/* =========================================================
   CHAT LIST ITEM
   ========================================================= */
const Chat = ({ chat, setSelectedChat, isOnline }) => {
  const { user: loggedInUser } = UserData();

  if (!chat) return null;

  // Assuming 1–1 chat (same logic you already had)
  const user = chat.users[0];
  if (!user) return null;

  const isSender =
    loggedInUser._id === chat.latestMessage?.sender;

  const lastMessage =
    chat.latestMessage?.text
      ? chat.latestMessage.text.slice(0, 24) +
        (chat.latestMessage.text.length > 24 ? "…" : "")
      : "No messages yet";

  return (
    <div
      onClick={() => setSelectedChat(chat)}
      className="
        card
        px-3 py-2
        mt-3
        cursor-pointer
        hover:bg-gray-50
        transition
      "
    >
      {/* Top Row */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <img
            src={user.profilePic.url}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Online Indicator */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* Name + Last Message */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">
            {user.name}
          </p>

          <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
            {isSender && <BsSendCheck />}
            <span>{lastMessage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
