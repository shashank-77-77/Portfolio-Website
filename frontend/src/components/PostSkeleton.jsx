import React from "react";

/* =========================================================
   POST SKELETON (FEED LOADING STATE)
   ========================================================= */
const PostSkeleton = () => {
  return (
    <div className="card w-full max-w-md p-4 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <div className="skeleton w-10 h-10 rounded-full" />

        {/* Name + Date */}
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-1/3" />
          <div className="skeleton h-2 w-1/4" />
        </div>
      </div>

      {/* Caption */}
      <div className="skeleton h-3 w-3/4 mb-4" />

      {/* Media */}
      <div className="skeleton h-[320px] w-full rounded-xl mb-4" />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-3 w-24" />
      </div>
    </div>
  );
};

export default PostSkeleton;
