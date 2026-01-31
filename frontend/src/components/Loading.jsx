import React from "react";

/* =========================================================
   FULL PAGE LOADING (APP / FEED / ROUTE LEVEL)
   ========================================================= */
export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main)]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>

        {/* Optional context text */}
        <p className="text-sm text-gray-500 tracking-wide">
          Loading, please wait…
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   INLINE LOADING (BUTTONS / ACTIONS)
   ========================================================= */
export const LoadingAnimation = () => {
  return (
    <span
      className="
        inline-block
        w-4 h-4
        border-2
        border-white
        border-t-transparent
        rounded-full
        animate-spin
      "
    />
  );
};

/* =========================================================
   SKELETON BLOCK (OPTIONAL – FUTURE USE)
   ========================================================= */
export const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`skeleton ${className}`}
      aria-hidden="true"
    />
  );
};
