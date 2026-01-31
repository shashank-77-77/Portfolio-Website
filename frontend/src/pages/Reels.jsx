import React, { useState } from "react";
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";

import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { Loading } from "../components/Loading";

import { PostData } from "../context/PostContext";

/* =========================================================
   REELS PAGE
   ========================================================= */
const Reels = () => {
  const { reels = [], loading } = PostData();
  const [index, setIndex] = useState(0);

  /* =========================================================
     NAVIGATION
     ========================================================= */
  const prevReel = () =>
    setIndex((i) => (i > 0 ? i - 1 : i));

  const nextReel = () =>
    setIndex((i) =>
      i < reels.length - 1 ? i + 1 : i
    );

  /* =========================================================
     GUARD
     ========================================================= */
  if (loading) return <Loading />;

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-16">
      <div className="feed">
        {/* Add Reel */}
        <AddPost type="reel" />

        {/* Reel Viewer */}
        {reels.length > 0 ? (
          <div className="flex justify-center items-center gap-4">
            <PostCard
              key={reels[index]._id}
              value={reels[index]}
              type="reel"
            />

            {/* Controls */}
            <div className="flex flex-col gap-4">
              {index > 0 && (
                <button
                  onClick={prevReel}
                  className="btn-primary rounded-full p-4"
                >
                  <FaArrowUp />
                </button>
              )}

              {index < reels.length - 1 && (
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
      </div>
    </div>
  );
};

export default Reels;
