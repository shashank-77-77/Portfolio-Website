import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChatData } from "../../context/ChatContext";

/* =========================================================
   MESSAGE INPUT (COMPOSER)
   ========================================================= */
const MessageInput = ({ setMessages, selectedChat }) => {
  const [textMsg, setTextMsg] = useState("");
  const [sending, setSending] = useState(false);
  const { setChats } = ChatData();

  /* =========================================================
     SEND MESSAGE
     ========================================================= */
  const handleMessage = async (e) => {
    e.preventDefault();

    if (!textMsg.trim() || sending) return;

    try {
      setSending(true);

      const { data } = await axios.post("/api/messages", {
        message: textMsg,
        recieverId: selectedChat.users[0]._id,
      });

      /* Update local messages immediately (optimistic UI) */
      setMessages((prev) => [...prev, data]);

      /* Update chat list latest message */
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChat._id
            ? {
                ...chat,
                latestMessage: {
                  text: textMsg,
                  sender: data.sender,
                },
              }
            : chat
        )
      );

      setTextMsg("");
    } catch (error) {
      console.error("Send message failed", error);
      toast.error(
        error?.response?.data?.message || "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <form
      onSubmit={handleMessage}
      className="
        flex items-center gap-2
        p-3
        border-t
        bg-white
        sticky bottom-0
      "
    >
      {/* Input */}
      <input
        type="text"
        placeholder="Type a message…"
        value={textMsg}
        onChange={(e) => setTextMsg(e.target.value)}
        className="flex-1 custom-input"
        disabled={sending}
      />

      {/* Send Button */}
      <button
        type="submit"
        disabled={sending || !textMsg.trim()}
        className="btn-primary"
      >
        {sending ? "Sending…" : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;
