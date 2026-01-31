import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";

/* =========================================================
   LOGIN
   ========================================================= */
const Login = () => {
  const navigate = useNavigate();

  const { loginUser, loading } = UserData();
  const { fetchPosts } = PostData();

  /* =========================================================
     FORM STATE
     ========================================================= */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* =========================================================
     SUBMIT
     ========================================================= */
  const submitHandler = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    loginUser(email, password, navigate, fetchPosts);
  };

  /* =========================================================
     LOADING STATE
     ========================================================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main)]">
        <p className="text-gray-500">Signing you in…</p>
      </div>
    );
  }

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="flex justify-center min-h-screen bg-[var(--bg-main)]">
      <div className="flex flex-col md:flex-row card max-w-5xl w-[92%] md:mt-24 overflow-hidden">
        {/* Left / Form */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">
            Login to Social Media
          </h1>

          <form onSubmit={submitHandler}>
            <div className="flex flex-col items-center gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input"
                required
              />

              <button type="submit" className="auth-btn">
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Right / CTA */}
        <div className="flex items-center justify-center md:w-1/3 bg-gradient-to-br from-blue-500 to-cyan-400 text-white p-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-semibold">
              New here?
            </h2>
            <p>Create an account and get started</p>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-500 px-5 py-1 rounded-full font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
