import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { connectWebSocket } from "../websocket/socket";

function Navbar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const disconnect = connectWebSocket((ticket) => {
      setNotifications((prev) => prev + 1);
    });

    return () => {
      if (disconnect) disconnect();
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar-container">

      {/* SEARCH BAR */}
      <div className="search-wrapper group">
        <svg
          className="search-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tickets by ID, subject, or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          className="search-input"
        />
      </div>

      {/* ACTIONS CONTAINER */}
      <div className="topbar-actions">

        {/* NOTIFICATION BELL */}
        <button
          className="notification-btn"
          title="New ticket notifications"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications > 0 && (
            <span className="notification-badge">
              {notifications > 99 ? '99+' : notifications}
            </span>
          )}
        </button>

        {/* USER INFO */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 md:pl-6">
          <div className="user-avatar">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
          {/* Hide username on very small mobile screens to save space */}
          <span className="text-sm font-medium text-slate-700 hidden sm:block">
            {username || "User"}
          </span>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="btn-danger-soft"
          title="Logout"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:block">Logout</span>
        </button>

      </div>
    </header>
  );
}

export default Navbar;