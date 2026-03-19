import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axiosClient";
import { useAuth } from "../../auth/AuthContext"; // Reusing your auth context for the greeting

function UserDashboard() {
  const { username } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Fetch all user tickets to calculate stats and show recent ones
        const res = await axios.get("/tickets/my");
        setTickets(res.data || []);
      } catch (err) {
        console.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats on the frontend
  const totalTickets = tickets.length;
  const activeTickets = tickets.filter(t => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
  const resolvedTickets = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;

  // Grab only the 3 most recent tickets for the activity feed
  const recentTickets = tickets.slice(0, 3);

  // Reusing the status helper
  const getStatusConfig = (status) => {
    switch (status) {
      case "OPEN": return "bg-amber-100 text-amber-800 border-amber-200";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-200";
      case "RESOLVED": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "CLOSED": return "bg-slate-100 text-slate-500 border-slate-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">

      {/* WELCOME BANNER */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative background shape */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>

        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {username || "User"}! 👋
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base max-w-lg">
            How can we help you today? View your recent ticket activity or submit a new request if you need assistance.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Link to="/user/create-ticket" className="btn-primary shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Create New Ticket
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-white rounded-xl border border-slate-200"></div>
            <div className="h-32 bg-white rounded-xl border border-slate-200"></div>
            <div className="h-32 bg-white rounded-xl border border-slate-200"></div>
          </div>
        </div>
      ) : (
        <>
          {/* STATS GRID - Reusing the .stat-card classes from app.css */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="stat-card">
              <h2 className="stat-card-title">Total Requests</h2>
              <p className="stat-card-value text-indigo-600">{totalTickets}</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-card-title">Active / In Progress</h2>
              <p className="stat-card-value text-amber-500">{activeTickets}</p>
            </div>
            <div className="stat-card">
              <h2 className="stat-card-title">Resolved</h2>
              <p className="stat-card-value text-emerald-500">{resolvedTickets}</p>
            </div>
          </div>

          {/* TWO-COLUMN LAYOUT FOR CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">

            {/* LEFT COLUMN: Recent Activity */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
                <Link to="/user/my-tickets" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                  View All &rarr;
                </Link>
              </div>

              {recentTickets.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
                  <p className="text-slate-500 text-sm">You have no recent support activity.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                  {recentTickets.map(t => (
                    <div key={t.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-mono text-slate-400 font-medium shrink-0">#{t.id}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusConfig(t.status)}`}>
                            {t.status ? t.status.replace('_', ' ') : 'UNKNOWN'}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800 truncate">{t.subject}</h3>
                      </div>
                      <div className="shrink-0">
                        <span className="text-xs text-slate-500 font-medium px-2.5 py-1 bg-slate-100 rounded-md">
                          {t.category || 'General'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Support Resources / Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Links</h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/user/create-ticket" className="flex items-center p-3 rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors group">
                    <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Open a Ticket</p>
                      <p className="text-xs text-slate-500">Get help from our team</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/user/my-tickets" className="flex items-center p-3 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors group">
                    <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 group-hover:bg-emerald-200 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Track Status</p>
                      <p className="text-xs text-slate-500">View your ticket history</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default UserDashboard;