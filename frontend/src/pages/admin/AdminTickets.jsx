import { useEffect, useState } from "react";
import { getAllTickets, updateTicketStatus, searchTickets } from "../../api/ticketApi";
import { connectWebSocket } from "../../websocket/socket";
import { useSearchParams } from "react-router-dom";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [params] = useSearchParams();
  const query = params.get("query");

  // Single function to fetch data based on whether a query exists
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

  // Re-run whenever the search query changes
  useEffect(() => {
    fetchData();
  }, [query]);

  // Handle WebSocket separately
  useEffect(() => {
    connectWebSocket((newTicket) => {
      // Only add to list if we aren't currently viewing search results
      if (!query) {
        setTickets((prev) => [newTicket, ...prev]);
      }
    });
  }, [query]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTicketStatus(id, newStatus);
      fetchData(); // Refresh current view
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  return (
    <div className="p-6">
      {/* Dynamic Heading */}
      <h2 className="text-xl mb-4 font-bold">
        {query ? `Search Results for "${query}"` : "All Tickets"}
      </h2>

      {tickets.length === 0 && <p>No tickets found.</p>}

      {tickets.map((t) => {
        // Auto-close logic for display
        let displayStatus = t.status;
        if (t.status === "RESOLVED") {
          const resolvedTime = new Date(t.updatedAt || t.createdAt);
          const now = new Date();
          const hoursPassed = (now - resolvedTime) / (1000 * 60 * 60);
          if (hoursPassed >= 48) displayStatus = "CLOSED";
        }

        return (
          <div key={t.id} className="border p-3 mb-3 rounded shadow-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Ticket #{t.id}</span>
              <span className="text-sm font-medium">User: {t.createdBy || "Guest"}</span>
            </div>

            <h3 className="font-bold text-lg mt-1">{t.subject}</h3>

            <p className="text-gray-700 mb-2">{t.description}</p>

            <p className="text-gray-700 mb-2"> Category: {t.category} </p>

            <div className="flex items-center gap-4 border-t pt-2">
              <p className="text-sm">
                Current Status: <strong>{displayStatus}</strong>
              </p>

              <select
                value={t.status}
                onChange={(e) => handleStatusChange(t.id, e.target.value)}
                className="border rounded p-1 text-sm bg-white"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AdminTickets;