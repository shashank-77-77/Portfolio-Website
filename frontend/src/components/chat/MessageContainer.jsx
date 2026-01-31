import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { UserData } from "../../context/UserContext";
import { SocketData } from "../../context/SocketContext";
import { LoadingAnimation } from "../Loading";
import Message from "./Message";
import MessageInput from "./MessageInput";

/* =========================================================
   MESSAGE CONTAINER (CHAT THREAD)
   ========================================================= */
const MessageContainer = ({ selectedChat, setChats }) => {
  const { user } = UserData();
  const { socket } = SocketData();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  /* =========================================================
     FETCH MESSAGES ON CHAT CHANGE
     ========================================================= */
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/messages/${selectedChat.users[0]._id}`
        );
        setMessages(data || []);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  /* =========================================================
     SOCKET: RECEIVE NEW MESSAGE
     ========================================================= */
  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleNewMessage = (message) => {
      // Push message only if it belongs to current chat
      if (message.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
      }

      // Update chat list latest message
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === message.chatId
            ? {
                ...chat,
                latestMessage: {
                  text: message.text,
                  sender: message.sender,
                },
              }
            : chat
        )
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedChat, setChats]);

  /* =========================================================
     AUTO SCROLL TO BOTTOM
     ========================================================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================================================
     GUARD
     ========================================================= */
  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        Select a chat to start messaging
      </div>
    );
  }

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">
        <img
          src={selectedChat.users[0].profilePic.url}
          alt={selectedChat.users[0].name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <span className="font-semibold">
          {selectedChat.users[0].name}
        </span>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-[var(--bg-main)]">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <Message
                key={msg._id}
                message={msg.text}
                ownMessage={
                  msg.sender === user._id ||
                  msg.sender?._id === user._id
                }
              />
            ))
          ) : (
            <div className="text-center text-sm text-gray-400 mt-6">
              No messages yet. Say hi 👋
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      )}

      {/* Input */}
      <MessageInput
        setMessages={setMessages}
        selectedChat={selectedChat}
      />
    </div>
  );
};

export default MessageContainer;
