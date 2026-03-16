/*
Reusable top navigation bar for User/Admin dashboards.

Features:
1. Search tickets
2. Real-time notification bell (WebSocket updates)
3. Display logged-in username
4. Logout functionality
*/

import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { connectWebSocket } from "../websocket/socket";

function Navbar() {

  const { username, logout } = useAuth();
  const navigate = useNavigate();

  // Search input state
  const [search, setSearch] = useState("");

  // Notification counter for new tickets
  const [notifications, setNotifications] = useState(0);

  /*
  Establish WebSocket connection once when navbar loads.
  Whenever a new ticket event is received,
  increase notification counter.
  */
  useEffect(() => {

    const disconnect = connectWebSocket((ticket) => {

      setNotifications((prev) => prev + 1);

    });

    // cleanup when component unmounts
    return () => {
      if (disconnect) disconnect();
    };

  }, []);

  /*
  Handle search when user presses Enter.
  Redirects to search results page.
  */
  const handleSearch = (e) => {

    if (e.key === "Enter" && search.trim() !== "") {

      navigate(`/search?query=${encodeURIComponent(search)}`);

      setSearch("");

    }

  };

  /*
  Logout user and redirect to login page
  */
  const handleLogout = () => {

    logout();
    navigate("/login");

  };

  return (

    <div className="flex justify-between items-center bg-white shadow px-6 py-3">

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        className="border rounded-md p-2 w-96 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex items-center gap-6">

        {/* NOTIFICATION BELL */}
        <div
          className="relative cursor-pointer text-xl"
          title="New ticket notifications"
        >
          🔔

          {notifications > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full"
            >
              {notifications}
            </span>
          )}

        </div>

        {/* USER INFO */}
        <div className="flex items-center gap-2">

          {/* Avatar (first letter of username) */}
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold">

            {username ? username.charAt(0).toUpperCase() : "U"}

          </div>

          {/* Username */}
          <span className="font-medium">

            {username}

          </span>

        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
        >
          Logout
        </button>

      </div>

    </div>

  );

}

export default Navbar;