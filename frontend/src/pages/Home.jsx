import React from "react";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import AiChat from "../components/AiChat";
import { PostData } from "../context/PostContext";
import { Loading } from "../components/Loading";

/* =========================================================
   HOME / FEED ORCHESTRATION
   ========================================================= */
const Home = () => {
  const { posts, loading } = PostData();

  return (
    <div className="feed">
      {/* Create Post */}
      <AddPost type="post" />

      {/* AI Assistant */}
      <AiChat />

      {/* Feed */}
      {loading ? (
        <Loading />
      ) : posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            value={post}
            type="post"
          />
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default Home;

/* =========================================================
   EMPTY STATE (NO POSTS)
   ========================================================= */
const EmptyState = () => {
  return (
    <div className="card p-6 text-center mt-6">
      <h3 className="font-semibold text-lg mb-1">
        No posts yet
      </h3>
      <p className="text-sm text-gray-500">
        Be the first to share something with your network.
      </p>
    </div>
  );
};
