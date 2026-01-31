import React, { useState } from "react";
import axios from "axios";

const AiChat = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/ai/chat",
        { message },
        { withCredentials: true }
      );
      setReply(data.reply);
    } catch (err) {
      console.error(err);
      setReply("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="ai-chat-box">
      <h3>🤖 AI Copilot</h3>

      <input
        type="text"
        placeholder="Ask AI..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {reply && (
        <p className="ai-reply">
          <strong>AI:</strong> {reply}
        </p>
      )}
    </div>
  );
};

export default AiChat;
