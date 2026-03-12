/*

Admin/Agent ticket management panel.

Features:
- View all tickets
- Change ticket status
*/

import { useEffect, useState } from "react";
import { getAllTickets, updateTicketStatus } from "../api/ticketApi";

function AdminTickets(){

  const [tickets,setTickets] = useState([]);

  const loadTickets = async () => {
    const data = await getAllTickets();
    setTickets(data);
  };

  useEffect(()=>{
    loadTickets();
  },[]);

  const handleStatusChange = async (id,newStatus) => {

    try{

      await updateTicketStatus(id,newStatus);

      // refresh list after update
      loadTickets();

    }catch(err){
      console.error("Failed to update status");
    }
  };

  return(

    <div className="p-6">

      <h2 className="text-xl mb-4">
        All Tickets
      </h2>

      {tickets.map((t)=>{

        // auto-close logic (frontend only)
        let displayStatus = t.status;

        if(t.status === "RESOLVED"){

          const resolvedTime = new Date(t.updatedAt || t.createdAt);
          const now = new Date();

          const hoursPassed =
            (now - resolvedTime) / (1000 * 60 * 60);

          if(hoursPassed >= 48){
            displayStatus = "CLOSED";
          }
        }

        return(

          <div
            key={t.id}
            className="border p-3 mb-3"
          >

            <h3 className="font-bold">
              {t.subject}
            </h3>

            <p>{t.description}</p>

            <p>User: {t.createdBy}</p>

            <p>
              Status: {displayStatus}
            </p>

            <select
              value={t.status}
              onChange={(e)=>
                handleStatusChange(
                  t.id,
                  e.target.value
                )
              }
              className="border p-1 mt-2"
            >

              <option value="OPEN">OPEN</option>

              <option value="IN_PROGRESS">
                IN_PROGRESS
              </option>

              <option value="RESOLVED">
                RESOLVED
              </option>

              <option value="CLOSED">
                CLOSED
              </option>

            </select>

          </div>

        )

      })}

    </div>

  );
}

export default AdminTickets;