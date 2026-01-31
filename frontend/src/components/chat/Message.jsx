import React from "react";

/* =========================================================
   MESSAGE BUBBLE (CHAT)
   ========================================================= */
const Message = ({ ownMessage, message }) => {
  return (
    <div
      className={`flex mb-2 ${
        ownMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`message ${
          ownMessage ? "own" : "other"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default Message;
