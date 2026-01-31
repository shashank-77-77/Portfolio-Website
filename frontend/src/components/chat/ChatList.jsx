import React from "react";
import { ChatData } from "../../context/ChatContext";

const ChatList = () => {
  const { chats, setSelectedChat, fetchMessages } = ChatData();

  const openChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  /* ===============================
     EMPTY STATE
     =============================== */
  if (!chats || chats.length === 0) {
    return (
      <div className="w-[30%] border-r flex items-center justify-center">
        <p className="text-gray-500 text-center">
          No conversations yet
        </p>
      </div>
    );
  }

  /* ===============================
     CHAT LIST
     =============================== */
  return (
    <div className="w-[30%] border-r p-3 overflow-y-auto">
      {chats.map((chat) => {
        const friend = chat.user; // ✅ CORRECT FIELD

        return (
          <div
            key={chat._id}
            onClick={() => openChat(chat)}
            className="p-3 mb-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-3 transition"
          >
            <img
              src={friend?.profilePic?.url || "/avatar.png"}
              alt={friend?.name || "User"}
              className="w-9 h-9 rounded-full object-cover"
            />

            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {friend?.name || "User"}
              </span>

              {chat.latestMessage && (
                <span className="text-xs text-gray-500 truncate max-w-[140px]">
                  {chat.latestMessage.content}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
