import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LoadingAnimation } from "./Loading";

/* =========================================================
   LIKE MODAL (POST LIKES LIST)
   ========================================================= */
const LikeModal = ({ isOpen, onClose, id }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH LIKES (ON OPEN / ID CHANGE)
     ========================================================= */
  useEffect(() => {
    if (!isOpen || !id) return;

    const fetchLikes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/post/${id}`);
        setUsers(data || []);
      } catch (error) {
        console.error("Failed to fetch likes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [id, isOpen]);

  /* =========================================================
     GUARD
     ========================================================= */
  if (!isOpen) return null;

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative card w-[300px] max-h-[380px] p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Likes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="flex justify-center py-6">
              <LoadingAnimation />
            </div>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <Link
                key={user._id}
                to={`/user/${user._id}`}
                onClick={onClose}
                className="
                  flex items-center gap-3
                  px-3 py-2
                  rounded-xl
                  hover:bg-gray-100
                  transition
                "
              >
                <span className="text-xs text-gray-400 w-4">
                  {index + 1}
                </span>

                <img
                  src={user.profilePic.url}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />

                <span className="font-medium text-sm truncate">
                  {user.name}
                </span>
              </Link>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 mt-6">
              No likes yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikeModal;
