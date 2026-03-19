import { useEffect, useState } from "react";
import { getAllTickets, updateTicketStatus, searchTickets, deleteTicket } from "../../api/ticketApi";
import { connectWebSocket } from "../../websocket/socket";
import { useSearchParams } from "react-router-dom";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [params] = useSearchParams();
  const query = params.get("query");

  const fetchData = async () => {
    try {
      if (query) {
        const data = await searchTickets(query);
        setTickets(data);
      } else {
        const data = await getAllTickets();
        setTickets(data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  useEffect(() => {
    const disconnect = connectWebSocket((newTicket) => {
      if (!query) {
        setTickets((prev) => [newTicket, ...prev]);
      }
    });
    return () => {
      if (disconnect) disconnect();
    };
  }, [query]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTicketStatus(id, newStatus);
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmDelete) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete failed");
      alert("Failed to delete ticket");
    }
  };

  // Helper to get styling based on status
  const getStatusConfig = (status) => {
    switch (status) {
      case "OPEN": return { colorClass: "status-open", accent: "bg-amber-400" };
      case "IN_PROGRESS": return { colorClass: "status-in_progress", accent: "bg-blue-400" };
      case "RESOLVED": return { colorClass: "status-resolved", accent: "bg-emerald-400" };
      case "CLOSED": return { colorClass: "status-closed", accent: "bg-slate-300" };
      default: return { colorClass: "bg-gray-100 text-gray-800", accent: "bg-gray-300" };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {query ? `Search Results for "${query}"` : "Ticket Queue"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage and resolve customer support requests.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {tickets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">No tickets found</h3>
          <p className="mt-1 text-sm text-slate-500">New support requests will appear here.</p>
        </div>
      )}

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.map((t) => {
          let displayStatus = t.status;

          // 48-hour auto-close logic
//           if (t.status === "RESOLVED") {
//             const resolvedTime = new Date(t.updatedAt || t.createdAt);
//             const now = new Date();
//             const hoursPassed = (now - resolvedTime) / (1000 * 60 * 60);
//             if (hoursPassed >= 48) displayStatus = "CLOSED";
//           }

          const { colorClass, accent } = getStatusConfig(displayStatus);

          return (
            <div key={t.id} className="ticket-card group">
              {/* Status Accent Line */}
              <div className={`ticket-card-accent ${accent}`}></div>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0 pl-2">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-slate-400 font-medium">#{t.id}</span>
                  <span className={`badge ${colorClass}`}>
                    {displayStatus.replace('_', ' ')}
                  </span>
                  {/* Category Badge - crucial for a classification system */}
                  <span className="badge badge-category hidden sm:inline-flex">
                    {t.category}
                  </span>
                </div>

                <h3 className="ticket-subject">{t.subject}</h3>
                <p className="ticket-desc">{t.description}</p>

                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {t.createdBy || "Guest"}
                  </div>
                  {/* Show category on mobile where the top badge is hidden */}
                  <div className="sm:hidden flex items-center gap-1">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                     {t.category}
                  </div>
                </div>
              </div>

              {/* Actions Area (Right side on desktop, Bottom on mobile) */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:w-48 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">

                <select
                  value={displayStatus} // Bind to displayStatus to reflect auto-closures
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  className="select-sm w-full"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="btn-danger-soft w-full md:w-auto justify-center"
                  aria-label="Delete ticket"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="md:hidden">Delete</span>
                </button>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminTickets;