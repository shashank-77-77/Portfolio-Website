import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

import { ChatData } from "../context/ChatContext";
import { SocketData } from "../context/SocketContext";

import Chat from "../components/chat/Chat";
import MessageContainer from "../components/chat/MessageContainer";

/* =========================================================
   CHAT PAGE
   ========================================================= */
const ChatPage = ({ user }) => {
  const {
    createChat,
    selectedChat,
    setSelectedChat,
    chats = [],
    setChats,
  } = ChatData();

  const { onlineUsers } = SocketData();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [searching, setSearching] = useState(false);

  /* =========================================================
     FETCH CHATS (ON LOAD)
     ========================================================= */
  useEffect(() => {
    const getAllChats = async () => {
      try {
        const { data } = await axios.get("/api/messages/chats");
        setChats(data || []);
      } catch (error) {
        console.error("Failed to fetch chats", error);
      }
    };

    getAllChats();
  }, [setChats]);

  /* =========================================================
     SEARCH USERS (DEBOUNCED)
     ========================================================= */
  const canSearch = useMemo(
    () => query.trim().length > 0 && searchMode,
    [query, searchMode]
  );

  useEffect(() => {
    if (!canSearch) {
      setUsers([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setSearching(true);
        const { data } = await axios.get(
          `/api/user/all?search=${encodeURIComponent(query)}`
        );
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("User search failed", error);
        setUsers([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [canSearch, query]);

  /* =========================================================
     CREATE CHAT
     ========================================================= */
  const createNewChat = async (id) => {
    try {
      await createChat(id);
      setSearchMode(false);
      setQuery("");
      const { data } = await axios.get("/api/messages/chats");
      setChats(data || []);
    } catch (error) {
      console.error("Failed to create chat", error);
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-16">
      <div className="feed flex gap-4">
        {/* LEFT: CHAT LIST / SEARCH */}
        <div className="w-full md:w-[30%] card p-3">
          {/* Top Controls */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => {
                setSearchMode((p) => !p);
                setQuery("");
              }}
              className="btn-primary p-2 rounded-full"
            >
              {searchMode ? "✕" : <FaSearch />}
            </button>

            {searchMode && (
              <input
                type="text"
                placeholder="Search users"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="custom-input flex-1"
              />
            )}
          </div>

          {/* Content */}
          {searchMode ? (
            <div className="space-y-2">
              {searching ? (
                <p className="text-sm text-gray-500 text-center">
                  Searching…
                </p>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => createNewChat(u._id)}
                    className="
                      flex items-center gap-3
                      px-3 py-2
                      rounded-xl
                      cursor-pointer
                      hover:bg-gray-100
                      transition
                    "
                  >
                    <img
                      src={u.profilePic.url}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium truncate">
                      {u.name}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No users found
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {chats.length > 0 ? (
                chats.map((c) => (
                  <Chat
                    key={c._id}
                    chat={c}
                    setSelectedChat={setSelectedChat}
                    isOnline={onlineUsers.includes(c.users[0]._id)}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No chats yet
                </p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: MESSAGE AREA */}
        <div className="hidden md:block md:w-[70%] card p-0">
          {selectedChat ? (
            <MessageContainer
              selectedChat={selectedChat}
              setChats={setChats}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-lg">
              Hello 👋 {user.name}, select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
