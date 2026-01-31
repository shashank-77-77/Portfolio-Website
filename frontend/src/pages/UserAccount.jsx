import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { PostData } from "../context/PostContext";
import { UserData } from "../context/UserContext";
import { SocketData } from "../context/SocketContext";

import PostCard from "../components/PostCard";
import Modal from "../components/Modal";
import { Loading } from "../components/Loading";

import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";

/* =========================================================
   USER ACCOUNT / PROFILE PAGE
   ========================================================= */
const UserAccount = ({ user: loggedInUser }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { posts = [], reels = [] } = PostData();
  const { followUser } = UserData();
  const { onlineUsers } = SocketData();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("post"); // post | reel
  const [reelIndex, setReelIndex] = useState(0);

  const [followed, setFollowed] = useState(false);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);

  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  /* =========================================================
     FETCH USER
     ========================================================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/user/${id}`);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  /* =========================================================
     FOLLOW STATE
     ========================================================= */
  useEffect(() => {
    if (!user || !loggedInUser) return;
    setFollowed(user.followers?.includes(loggedInUser._id));
  }, [user, loggedInUser]);

  const followHandler = () => {
    if (!user) return;
    setFollowed((p) => !p);
    followUser(user._id, () => {
      // refresh profile data
      axios.get(`/api/user/${id}`).then(({ data }) => setUser(data));
    });
  };

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
          <img
            src={user.profilePic.url}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover"
          />

          {/* Info */}
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg">
                {user.name}
              </h2>
              {onlineUsers.includes(user._id) && (
                <span className="text-xs text-green-500">
                  Online
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500">
              {user.email}
            </p>
            <p className="text-sm text-gray-500">
              {user.gender}
            </p>

            <div className="flex gap-4 text-sm mt-1">
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

            {user._id !== loggedInUser._id && (
              <button
                onClick={followHandler}
                className={`mt-2 btn-primary ${
                  followed ? "bg-red-500" : ""
                }`}
              >
                {followed ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="card p-3 flex justify-center gap-8 mb-4">
          <button
            onClick={() => setTab("post")}
            className={`${
              tab === "post" ? "font-semibold" : "text-gray-500"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setTab("reel")}
            className={`${
              tab === "reel" ? "font-semibold" : "text-gray-500"
            }`}
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

export default UserAccount;
