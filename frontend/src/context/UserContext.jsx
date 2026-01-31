import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axios";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  async function registerUser(formdata, navigate, fetchPosts) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", formdata);

      toast.success(data.message);
      setIsAuth(true);
      setUser(data.user);
      navigate("/");
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  async function loginUser(email, password, navigate, fetchPosts) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      toast.success(data.message);
      setIsAuth(true);
      setUser(data.user);
      navigate("/");
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await api.get("/user/me");
      setUser(data);
      setIsAuth(true);
    } catch {
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  async function logoutUser(navigate) {
    try {
      const { data } = await api.get("/auth/logout");
      toast.success(data.message);
      setUser(null);
      setIsAuth(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  async function followUser(id) {
    try {
      const { data } = await api.post(`/user/follow/${id}`);
      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  async function updateProfilePic(id, formdata, setFile) {
    try {
      const { data } = await api.put(`/user/${id}`, formdata);
      toast.success(data.message);
      fetchUser();
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  async function updateProfileName(id, name, setShowInput) {
    try {
      const { data } = await api.put(`/user/${id}`, { name });
      toast.success(data.message);
      fetchUser();
      setShowInput(false);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loginUser,
        registerUser,
        logoutUser,
        followUser,
        updateProfilePic,
        updateProfileName,
        user,
        isAuth,
        loading,
        setUser,
        setIsAuth,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
