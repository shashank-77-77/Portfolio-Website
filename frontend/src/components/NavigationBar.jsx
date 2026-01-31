import React from "react";
import { Link, useLocation } from "react-router-dom";

import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsCameraReelsFill, BsCameraReels } from "react-icons/bs";
import { IoSearchCircleOutline, IoSearchCircle } from "react-icons/io5";
import {
  IoChatbubbleEllipses,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import { RiAccountCircleFill, RiAccountCircleLine } from "react-icons/ri";

/* =========================================================
   BOTTOM NAVIGATION BAR
   ========================================================= */
const NavigationBar = () => {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-3">
        {/* Home */}
        <NavItem
          to="/"
          active={activePath === "/"}
          iconActive={<AiFillHome />}
          iconInactive={<AiOutlineHome />}
        />

        {/* Reels */}
        <NavItem
          to="/reels"
          active={activePath === "/reels"}
          iconActive={<BsCameraReelsFill />}
          iconInactive={<BsCameraReels />}
        />

        {/* Search */}
        <NavItem
          to="/search"
          active={activePath === "/search"}
          iconActive={<IoSearchCircle />}
          iconInactive={<IoSearchCircleOutline />}
        />

        {/* Chat */}
        <NavItem
          to="/chat"
          active={activePath === "/chat"}
          iconActive={<IoChatbubbleEllipses />}
          iconInactive={<IoChatbubbleEllipsesOutline />}
        />

        {/* Account */}
        <NavItem
          to="/account"
          active={activePath === "/account"}
          iconActive={<RiAccountCircleFill />}
          iconInactive={<RiAccountCircleLine />}
        />
      </div>
    </div>
  );
};

export default NavigationBar;

/* =========================================================
   NAV ITEM (REUSABLE, SCALABLE)
   ========================================================= */
const NavItem = ({ to, active, iconActive, iconInactive }) => {
  return (
    <Link
      to={to}
      className={`nav-item text-2xl ${
        active ? "active" : "text-gray-500"
      }`}
    >
      {active ? iconActive : iconInactive}
    </Link>
  );
};
