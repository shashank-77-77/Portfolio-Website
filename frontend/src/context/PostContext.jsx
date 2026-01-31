import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { UserData } from "./UserContext";

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const { isAuth, loading: authLoading } = UserData(); // 🔴 IMPORTANT

  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    try {
      const { data } = await api.get("/post/all");
      setPosts(data.posts);
      setReels(data.reels);
    } catch {
      setPosts([]);
      setReels([]);
    } finally {
      setLoading(false);
    }
  }

  async function addPost(formdata, setFile, setFilePrev, setCaption, type) {
    // ⛔ auth still initializing
    if (authLoading) {
      toast.error("Checking login status...");
      return;
    }

    // ⛔ not logged in
    if (!isAuth) {
      toast.error("Please login first");
      return;
    }

    setAddLoading(true);
    try {
      const { data } = await api.post(`/post/new?type=${type}`, formdata);
      toast.success(data.message);
      fetchPosts();
      setFile("");
      setFilePrev("");
      setCaption("");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setAddLoading(false);
    }
  }

  async function likePost(id) {
    if (authLoading) return;
    if (!isAuth) {
      toast.error("Please login first");
      return;
    }

    try {
      const { data } = await api.post(`/post/like/${id}`);
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  async function addComment(id, comment, setComment, setShow) {
    if (authLoading) return;
    if (!isAuth) {
      toast.error("Please login first");
      return;
    }

    try {
      const { data } = await api.post(`/post/comment/${id}`, { comment });
      toast.success(data.message);
      fetchPosts();
      setComment("");
      setShow(false);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  async function deletePost(id) {
    if (authLoading) return;
    if (!isAuth) {
      toast.error("Please login first");
      return;
    }

    try {
      const { data } = await api.delete(`/post/${id}`);
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  async function deleteComment(id, commentId) {
    if (authLoading) return;
    if (!isAuth) {
      toast.error("Please login first");
      return;
    }

    try {
      const { data } = await api.delete(
        `/post/comment/${id}?commentId=${commentId}`
      );
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  // 🔴 ONLY FETCH POSTS AFTER AUTH IS READY
  useEffect(() => {
    if (!authLoading && isAuth) {
      fetchPosts();
    }

    if (!authLoading && !isAuth) {
      setPosts([]);
      setReels([]);
    }
  }, [isAuth, authLoading]);

  return (
    <PostContext.Provider
      value={{
        posts,
        reels,
        loading,
        addLoading,
        fetchPosts,
        addPost,
        likePost,
        addComment,
        deletePost,
        deleteComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const PostData = () => useContext(PostContext);
