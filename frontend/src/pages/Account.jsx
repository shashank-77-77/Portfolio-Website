import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";

import PostCard from "../components/PostCard";
import Modal from "../components/Modal";
import { Loading } from "../components/Loading";

import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";

/* =========================================================
   ACCOUNT (LOGGED-IN USER PROFILE)
   ========================================================= */
const Account = ({ user }) => {
  const navigate = useNavigate();

  const {
    logoutUser,
    updateProfilePic,
    updateProfileName,
  } = UserData();

  const { posts = [], reels = [], loading } = PostData();

  /* =========================================================
     LOCAL STATE
     ========================================================= */
  const [tab, setTab] = useState("post");
  const [reelIndex, setReelIndex] = useState(0);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);

  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  const [file, setFile] = useState(null);

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* =========================================================
     DERIVED DATA
     ========================================================= */
  const myPosts = useMemo(
    () => posts.filter((p) => p.owner?._id === user?._id),
    [posts, user]
  );

  const myReels = useMemo(
    () => reels.filter((r) => r.owner?._id === user?._id),
    [reels, user]
  );

  /* =========================================================
     FOLLOW DATA (MODALS)
     ========================================================= */
  useEffect(() => {
    if (!user?._id) return;

    const fetchFollowData = async () => {
      try {
        const { data } = await axios.get(
          `/api/user/followdata/${user._id}`
        );
        setFollowersData(data.followers || []);
        setFollowingsData(data.followings || []);
      } catch (error) {
        console.error("Failed to fetch follow data", error);
      }
    };

    fetchFollowData();
  }, [user]);

  /* =========================================================
     HANDLERS
     ========================================================= */
  const logoutHandler = () => {
    logoutUser(navigate);
  };

  const changeFileHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const changeImageHandler = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    updateProfilePic(user._id, formData, setFile);
  };

  const updateNameHandler = () => {
    if (!name.trim()) return;
    updateProfileName(user._id, name, setEditingName);
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/${user._id}`, {
        oldPassword,
        newPassword,
      });

      toast.success(data.message);
      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Password update failed"
      );
    }
  };

  const prevReel = () =>
    setReelIndex((i) => (i > 0 ? i - 1 : i));

  const nextReel = () =>
    setReelIndex((i) =>
      i < myReels.length - 1 ? i + 1 : i
    );

  /* =========================================================
     GUARD
     ========================================================= */
  if (loading) return <Loading />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-16">
      {/* Modals */}
      {showFollowers && (
        <Modal
          value={followersData}
          title="Followers"
          setShow={setShowFollowers}
        />
      )}
      {showFollowings && (
        <Modal
          value={followingsData}
          title="Followings"
          setShow={setShowFollowings}
        />
      )}

      <div className="feed">
        {/* Profile Card */}
        <div className="card p-6 flex gap-6 mb-4">
          {/* Avatar */}
          <div className="flex flex-col gap-3">
            <img
              src={user.profilePic.url}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover"
            />

            <input type="file" onChange={changeFileHandler} />
            <button
              onClick={changeImageHandler}
              className="btn-primary text-sm"
            >
              Update Profile
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2 flex-1">
            {/* Name */}
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  className="custom-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  onClick={updateNameHandler}
                  className="btn-primary text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  className="text-sm text-gray-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg">
                  {user.name}
                </h2>
                <button onClick={() => setEditingName(true)}>
                  <CiEdit />
                </button>
              </div>
            )}

            <p className="text-sm text-gray-500">
              {user.email}
            </p>
            <p className="text-sm text-gray-500">
              {user.gender}
            </p>

            <div className="flex gap-4 text-sm">
              <button
                onClick={() => setShowFollowers(true)}
                className="hover:underline"
              >
                {user.followers.length} followers
              </button>
              <button
                onClick={() => setShowFollowings(true)}
                className="hover:underline"
              >
                {user.followings.length} following
              </button>
            </div>

            <button
              onClick={logoutHandler}
              className="bg-red-500 text-white rounded-md px-4 py-2 mt-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Password Update */}
        <button
          onClick={() => setShowPasswordForm((p) => !p)}
          className="btn-primary mb-4"
        >
          {showPasswordForm ? "Cancel" : "Update Password"}
        </button>

        {showPasswordForm && (
          <form
            onSubmit={updatePassword}
            className="card p-4 mb-4 flex flex-col gap-3"
          >
            <input
              type="password"
              className="custom-input"
              placeholder="Old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="custom-input"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              Save Password
            </button>
          </form>
        )}

        {/* Tabs */}
        <div className="card p-3 flex justify-center gap-8 mb-4">
          <button
            onClick={() => setTab("post")}
            className={
              tab === "post"
                ? "font-semibold"
                : "text-gray-500"
            }
          >
            Posts
          </button>
          <button
            onClick={() => setTab("reel")}
            className={
              tab === "reel"
                ? "font-semibold"
                : "text-gray-500"
            }
          >
            Reels
          </button>
        </div>

        {/* Content */}
        {tab === "post" && (
          <>
            {myPosts.length > 0 ? (
              myPosts.map((p) => (
                <PostCard
                  key={p._id}
                  value={p}
                  type="post"
                />
              ))
            ) : (
              <div className="card p-6 text-center">
                No posts yet
              </div>
            )}
          </>
        )}

        {tab === "reel" && (
          <>
            {myReels.length > 0 ? (
              <div className="flex items-center gap-4 justify-center">
                <PostCard
                  value={myReels[reelIndex]}
                  type="reel"
                  key={myReels[reelIndex]._id}
                />

                <div className="flex flex-col gap-4">
                  {reelIndex > 0 && (
                    <button
                      onClick={prevReel}
                      className="btn-primary rounded-full p-4"
                    >
                      <FaArrowUp />
                    </button>
                  )}
                  {reelIndex < myReels.length - 1 && (
                    <button
                      onClick={nextReel}
                      className="btn-primary rounded-full p-4"
                    >
                      <FaArrowDownLong />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="card p-6 text-center">
                No reels yet
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
