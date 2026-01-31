import { useEffect, useRef, useState } from "react";
import { ChatData } from "../../context/ChatContext";
import { UserData } from "../../context/UserContext";

const ChatBox = () => {
  const {
    selectedChat,
    messages = [],
    fetchMessages,
    sendMessage,
    loading, import { useEffect, useRef, useState } from "react";
import { ChatData } from "../../context/ChatContext";
import { UserData } from "../../context/UserContext";

/* =========================================================
   CHAT BOX (CORE MESSAGING SURFACE)
   ========================================================= */
const ChatBox = () => {
  const {
    selectedChat,
    messages = [],
    fetchMessages,
    sendMessage,
    loading,
  } = ChatData();

  const { user } = UserData();
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  /* =========================================================
     GUARD STATE — NO CHAT SELECTED
     ========================================================= */
  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        Select a conversation to get started
      </div>
    );
  }

  /* =========================================================
     FETCH MESSAGES ON CHAT SWITCH
     ========================================================= */
  useEffect(() => {
    fetchMessages(selectedChat._id);
  }, [selectedChat, fetchMessages]);

  /* =========================================================
     AUTO-SCROLL (STABLE, NO JANK)
     ========================================================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================================================
     SEND MESSAGE HANDLER
     ========================================================= */
  const onSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    try {
      await sendMessage(text);
      setText("");
    } catch {
      // silent fail to avoid UX disruption
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="flex flex-col h-full bg-[var(--bg-main)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length > 0 ? (
          messages.map((m) => {
            const isMe =
              m.sender?._id === user._id || m.sender === user._id;

            return (
              <div
                key={m._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`message ${
                    isMe ? "own" : "other"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-sm text-gray-400 mt-6">
            No messages yet. Say hello 👋
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={onSend}
        className="border-t border-gray-200 p-3 flex items-center gap-2 bg-white sticky bottom-0"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 custom-input"
        />

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="btn-primary"
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;

  } = ChatData();

  const { user } = UserData();
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  /* ===============================
     GUARD: NO CHAT SELECTED
     =============================== */
  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start conversation
      </div>
    );
  }

  /* ===============================
     LOAD MESSAGES ON CHAT CHANGE
     =============================== */
  useEffect(() => {
    fetchMessages(selectedChat._id);
  }, [selectedChat]);

  /* ===============================
     AUTO SCROLL
     =============================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ===============================
     SEND MESSAGE
     =============================== */
  const onSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await sendMessage(text);
      setText("");
    } catch {
      alert("Message failed to send");
    }
  };

  /* ===============================
     RENDER
     =============================== */
  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => {
          const isMe =
            m.sender?._id === user._id || m.sender === user._id;

          return (
            <div
              key={m._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                  isMe
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={onSend}
        className="border-t p-3 flex gap-2 items-center"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message…"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
