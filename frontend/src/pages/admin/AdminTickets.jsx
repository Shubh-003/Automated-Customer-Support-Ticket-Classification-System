/*
- View all tickets / search results
- Real-time updates (WebSocket)
- Update ticket status
- Delete ticket (ADMIN only)
*/

import { useEffect, useState } from "react";
import { getAllTickets,updateTicketStatus,searchTickets,deleteTicket} from "../../api/ticketApi";
import { connectWebSocket } from "../../websocket/socket";
import { useSearchParams } from "react-router-dom";

function AdminTickets() {

  const [tickets, setTickets] = useState([]);

  const [params] = useSearchParams();
  const query = params.get("query");

  /*  Fetch tickets (search or all)  */
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

  /*  WebSocket → real-time new ticket  */
  useEffect(() => {
    connectWebSocket((newTicket) => {
      // Avoid messing search results
      if (!query) {
        setTickets(prev => [newTicket, ...prev]);
      }

    });

  }, [query]);

  /*  Update ticket status  */
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTicketStatus(id, newStatus);
      // Optimistic UI update (better than refetch)
      setTickets(prev =>
        prev.map(t =>
          t.id === id ? { ...t, status: newStatus } : t
        )
      );

    } catch (err) {
      console.error("Failed to update status");
    }
  };

  /*  Delete ticket  */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTicket(id);

      // Remove from UI instantly (no reload)
      setTickets(prev => prev.filter(t => t.id !== id));

    } catch (err) {
      console.error("Delete failed");
      alert("Failed to delete ticket");
    }

  };

  return (

    <div className="p-6">

      <h2 className="text-xl mb-4 font-bold">
        {query ? `Search Results for "${query}"` : "All Tickets"}
      </h2>

      {tickets.length === 0 && <p>No tickets found.</p>}

      {tickets.map((t) => {

        let displayStatus = t.status;

        if (t.status === "RESOLVED") {
          const resolvedTime = new Date(t.updatedAt || t.createdAt);
          const now = new Date();
          const hoursPassed = (now - resolvedTime) / (1000 * 60 * 60);

          if (hoursPassed >= 48) displayStatus = "CLOSED";
        }

        return (

          <div
            key={t.id}
            className="border p-3 mb-3 rounded shadow-sm"
          >

            <div className="flex justify-between">

              <span className="text-gray-500 text-sm">
                Ticket #{t.id}
              </span>

              <span className="text-sm font-medium">
                User: {t.createdBy || "Guest"}
              </span>

            </div>

            <h3 className="font-bold text-lg mt-1">
              {t.subject}
            </h3>

            <p className="text-gray-700 mb-2">
              {t.description}
            </p>

            <p className="text-gray-700 mb-2">
              Category: {t.category}
            </p>

            <div className="flex items-center justify-between border-t pt-2">

              {/* LEFT: Status */}
              <div className="flex items-center gap-4">

                <p className="text-sm">
                  Status: <strong>{displayStatus}</strong>
                </p>

                <select
                  value={t.status}
                  onChange={(e) =>
                    handleStatusChange(t.id, e.target.value)
                  }
                  className="border rounded p-1 text-sm bg-white"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDelete(t.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>

            </div>

          </div>

        );

      })}

    </div>

  );

}

export default AdminTickets;