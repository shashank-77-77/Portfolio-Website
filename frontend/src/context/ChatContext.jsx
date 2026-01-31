import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  async function createChat(id) {
    try {
      await api.post("/messages", {
        recieverId: id,
        message: "hii",
      });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  return (
    <ChatContext.Provider
      value={{ createChat, chats, setChats, selectedChat, setSelectedChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
