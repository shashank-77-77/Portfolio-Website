import React from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   404 — NOT FOUND
   ========================================================= */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main)]">
      <div className="card w-full max-w-md p-8 text-center">
        {/* Brand */}
        <div className="text-sm text-gray-500 mb-2">
          Social Media Platform
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-semibold mb-2">
          Page not found
        </h1>

        {/* Subtext */}
        <p className="text-gray-500 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => navigate("/")}
          className="btn-primary"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound;
