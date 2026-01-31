import React, { useEffect, useState } from "react";
import { BsChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import axios from "axios";

import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import { SocketData } from "../context/SocketContext";

import SimpleModal from "./SimpleModal";
import LikeModal from "./LikeModal";
import { LoadingAnimation } from "./Loading";

/* =========================================================
   POST CARD
   ========================================================= */
const PostCard = ({ type, value }) => {
  const { user } = UserData();
  const { likePost, addComment, deletePost, loading, fetchPosts } = PostData();
  const { onlineUsers } = SocketData();

  const [isLike, setIsLike] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const [comment, setComment] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [caption, setCaption] = useState(value.caption || "");
  const [captionLoading, setCaptionLoading] = useState(false);

  const formatDate = format(new Date(value.createdAt), "MMMM do");

  /* =========================================================
     LIKE STATE SYNC
     ========================================================= */
  useEffect(() => {
    setIsLike(value.likes.includes(user._id));
  }, [value.likes, user._id]);

  /* =========================================================
     HANDLERS
     ========================================================= */
  const likeHandler = () => {
    setIsLike((prev) => !prev);
    likePost(value._id);
  };

  const addCommentHandler = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(value._id, comment, setComment, setShowComments);
  };

  const deleteHandler = () => {
    deletePost(value._id);
    setShowMenu(false);
  };

  const updateCaption = async () => {
    if (!caption.trim()) return;

    setCaptionLoading(true);
    try {
      const { data } = await axios.put(`/api/post/${value._id}`, { caption });
      toast.success(data.message);
      fetchPosts();
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setCaptionLoading(false);
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="flex justify-center py-6">
      {/* Owner Menu Modal */}
      <SimpleModal isOpen={showMenu} onClose={() => setShowMenu(false)}>
        <LikeModal
          isOpen={showLikes}
          onClose={() => setShowLikes(false)}
          id={value._id}
        />

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setEditMode(true);
              setShowMenu(false);
            }}
            className="btn-primary"
          >
            Edit Caption
          </button>

          <button
            onClick={deleteHandler}
            disabled={loading}
            className="bg-red-500 text-white rounded-xl py-2"
          >
            {loading ? <LoadingAnimation /> : "Delete Post"}
          </button>
        </div>
      </SimpleModal>

      {/* Post Card */}
      <div className="card w-full max-w-md p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <Link
            to={`/user/${value.owner._id}`}
            className="flex items-center gap-3"
          >
            <img
              src={value.owner.profilePic.url}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
            />

            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{value.owner.name}</p>
                {onlineUsers.includes(value.owner._id) && (
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                )}
              </div>
              <p className="text-xs text-gray-500">{formatDate}</p>
            </div>
          </Link>

          {value.owner._id === user._id && (
            <button
              onClick={() => setShowMenu(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <BsThreeDotsVertical />
            </button>
          )}
        </div>

        {/* Caption */}
        <div className="mb-3">
          {editMode ? (
            <div className="flex flex-col gap-2">
              <input
                className="custom-input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={updateCaption}
                  disabled={captionLoading}
                  className="btn-primary"
                >
                  {captionLoading ? <LoadingAnimation /> : "Save"}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-200 rounded-xl px-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p>{value.caption}</p>
          )}
        </div>

        {/* Media */}
        <div className="rounded-xl overflow-hidden mb-3">
          {type === "post" ? (
            <img
              src={value.post.url}
              alt=""
              className="w-full object-cover"
            />
          ) : (
            <video
              src={value.post.url}
              className="w-full max-h-[520px] object-cover"
              autoPlay
              controls
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center text-gray-600 mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={likeHandler}
              className="text-2xl text-red-500"
            >
              {isLike ? <IoHeartSharp /> : <IoHeartOutline />}
            </button>

            <button
              onClick={() => setShowLikes(true)}
              className="text-sm hover:underline"
            >
              {value.likes.length} likes
            </button>
          </div>

          <button
            onClick={() => setShowComments((p) => !p)}
            className="flex items-center gap-2 hover:underline"
          >
            <BsChatFill />
            <span>{value.comments.length} comments</span>
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <>
            <form
              onSubmit={addCommentHandler}
              className="flex gap-2 my-3"
            >
              <input
                className="custom-input flex-1"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="btn-primary">
                Post
              </button>
            </form>

            <div className="max-h-[220px] overflow-y-auto">
              {value.comments.length > 0 ? (
                value.comments.map((c) => (
                  <Comment
                    key={c._id}
                    value={c}
                    user={user}
                    owner={value.owner._id}
                    id={value._id}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;

/* =========================================================
   COMMENT COMPONENT
   ========================================================= */
export const Comment = ({ value, user, owner, id }) => {
  const { deleteComment } = PostData();

  return (
    <div className="flex items-center gap-3 mt-3">
      <Link to={`/user/${value.user._id}`}>
        <img
          src={value.user.profilePic.url}
          className="w-7 h-7 rounded-full"
          alt=""
        />
      </Link>

      <div className="flex-1">
        <p className="text-sm font-semibold">{value.user.name}</p>
        <p className="text-xs text-gray-600">{value.comment}</p>
      </div>

      {(value.user._id === user._id || owner === user._id) && (
        <button
          onClick={() => deleteComment(id, value._id)}
          className="text-red-500"
        >
          <MdDelete />
        </button>
      )}
    </div>
  );
};
