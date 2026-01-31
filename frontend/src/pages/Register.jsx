import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";

/* =========================================================
   REGISTER
   ========================================================= */
const Register = () => {
  const navigate = useNavigate();

  const { registerUser, loading } = UserData();
  const { fetchPosts } = PostData();

  /* =========================================================
     FORM STATE
     ========================================================= */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [file, setFile] = useState(null);
  const [filePrev, setFilePrev] = useState(null);

  /* =========================================================
     FILE HANDLER (PREVIEW)
     ========================================================= */
  const changeFileHandler = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);

    const reader = new FileReader();
    reader.readAsDataURL(selected);
    reader.onloadend = () => setFilePrev(reader.result);
  };

  /* =========================================================
     SUBMIT
     ========================================================= */
  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("file", file);

    registerUser(formData, navigate, fetchPosts);
  };

  /* =========================================================
     RENDER
     ========================================================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Creating your account…</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-[var(--bg-main)]">
      <div className="flex flex-col md:flex-row card max-w-5xl w-[92%] md:mt-12 overflow-hidden">
        {/* Left / Form */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">
            Register to Social Media
          </h1>

          <form onSubmit={submitHandler}>
            <div className="flex flex-col items-center gap-4">
              {/* Avatar Preview */}
              {filePrev && (
                <img
                  src={filePrev}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
              )}

              {/* Inputs */}
              <input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="custom-input"
                required
              />

              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="custom-input"
                required
              />

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

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="custom-input"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              {/* Submit */}
              <button type="submit" className="auth-btn">
                Register
              </button>
            </div>
          </form>
        </div>

        {/* Right / CTA */}
        <div className="flex items-center justify-center md:w-1/3 bg-gradient-to-br from-blue-500 to-cyan-400 text-white p-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-semibold">
              Already have an account?
            </h2>
            <p>Login and continue your journey</p>
            <Link
              to="/login"
              className="inline-block bg-white text-blue-500 px-5 py-1 rounded-full font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
