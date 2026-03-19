/*
Shows tickets created by the currently logged-in user.

API: GET /api/tickets/my

*/
import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import { connectWebSocket } from "../../websocket/socket";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/tickets/my");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();

    // Store the disconnect function
    const disconnect = connectWebSocket((newTicket) => {
      setTickets((prev) => [newTicket, ...prev]);
    });

    // Cleanup function prevents memory leaks when the user leaves the page
    return () => {
      if (disconnect) disconnect();
    };
  }, []);

  // Simple helper to color-code statuses
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "OPEN": return "bg-amber-100 text-amber-800 border-amber-200";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-200";
      case "RESOLVED": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "CLOSED": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-1 font-sans text-slate-900">

      {/* Clean Header */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">My Tickets</h2>
        <p className="text-sm text-slate-500 mt-1">Track the status and classification of your support requests.</p>
      </div>

      {/* Loading / Empty States */}
      {isLoading ? (
        <p className="text-slate-500 animate-pulse">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-slate-500">You haven't opened any support requests yet.</p>
        </div>
      ) : (

        /* Upgraded Ticket Cards */
        <div className="space-y-4">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Top Row: Meta Information */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="text-xs font-mono text-slate-400">
                  #{t.id || 'N/A'}
                </span>

                <div className="flex gap-2">
                  {/* Category Badge - Highlights the automated classification */}
{/*                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"> */}
{/*                     {t.category || "Uncategorized"} */}
{/*                   </span> */}

                  {/* Status Badge */}

                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(t.status)}`}>
                    {t.status ? t.status.replace('_', ' ') : "UNKNOWN"}
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {t.subject}
              </h3>

              <p className="text-sm text-slate-600 line-clamp-2">
                {t.description}
              </p>

              <p className="text-sm text-slate-600 line-clamp-2 mt-4">
                  Category : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {t.category || "Uncategorized"}
                             </span>
              </p>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default MyTickets;