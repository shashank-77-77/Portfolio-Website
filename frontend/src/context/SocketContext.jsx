import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserData } from "./UserContext";

/**
 * Resolve backend URL from environment
 * - development → http://localhost:5000
 * - production  → Render URL
 */
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { user } = UserData();

  useEffect(() => {
    // Do not initialize socket until user state is resolved
    if (!user?._id) {
      return;
    }

    const socketInstance = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      query: {
        userId: user._id,
      },
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("getOnlineUser", (users) => {
      setOnlineUsers(users);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketInstance.close();
      setSocket(null);
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);
