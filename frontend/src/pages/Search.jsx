import { useEffect, useMemo, useState } from "react";
import api from "../utils/axios";
import { UserData } from "../context/UserContext";
import toast from "react-hot-toast";

/* =========================================================
   SEARCH (USER DISCOVERY)
   ========================================================= */
const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuth, loading: authLoading } = UserData();

  /* =========================================================
     DERIVED STATE
     ========================================================= */
  const canSearch = useMemo(
    () => isAuth && !authLoading && query.trim().length > 0,
    [isAuth, authLoading, query]
  );

  /* =========================================================
     SEARCH HANDLER
     ========================================================= */
  const searchUsers = async () => {
    if (authLoading) return;

    if (!isAuth) {
      toast.error("Please login to search users");
      return;
    }

    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(
        `/user/all?search=${encodeURIComponent(query)}`
      );
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search failed", error);
      toast.error("Search failed. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     AUTO-SEARCH (DEBOUNCED BY EFFECT)
     ========================================================= */
  useEffect(() => {
    if (!canSearch) {
      setUsers([]);
      return;
    }

    const t = setTimeout(searchUsers, 350);
    return () => clearTimeout(t);
  }, [query, canSearch]); // eslint-disable-line

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="feed">
      {/* Search Bar */}
      <div className="card p-4 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="custom-input flex-1"
          />
          <button
            onClick={searchUsers}
            disabled={!canSearch || loading}
            className="btn-primary"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="card p-2">
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Searching users…
          </div>
        ) : users.length > 0 ? (
          users.map((u) => (
            <div
              key={u._id}
              className="
                flex items-center gap-3
                px-3 py-2
                rounded-xl
                hover:bg-gray-100
                transition
              "
            >
              <img
                src={u.profilePic?.url}
                alt={u.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium truncate">
                {u.name}
              </span>
            </div>
          ))
        ) : query ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No users found
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-gray-400">
            Start typing to search users
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
