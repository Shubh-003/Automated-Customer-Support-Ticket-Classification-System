/*
Shows tickets created by the currently logged-in user.

API: GET /api/tickets/my

*/

import { useEffect, useState } from "react";
import axios from "../api/axiosClient";

function MyTickets() {

  // store ticket list
  const [tickets, setTickets] = useState([]);

  const loadTickets = async () => {

    try {

      // fetch tickets from backend
      const res = await axios.get("/tickets/my");

      setTickets(res.data);

    } catch (err) {

      console.error("Failed to load tickets");

    }
  };

  // load tickets when page opens
  useEffect(() => {
    loadTickets();
  }, []);

  return (

    <div className="p-6">

      <h2 className="text-xl mb-4">
        My Tickets
      </h2>

      {tickets.map((t)=>(

        <div
          key={t.id}
          className="border p-3 mb-3"
        >

          <h3 className="font-bold">
            {t.subject}
          </h3>

          <p>
            {t.description}
          </p>

          <p>
            Category: {t.category}
          </p>

          <p>
            Status: {t.status}
          </p>



        </div>

      ))}

    </div>

  );
}

export default MyTickets;