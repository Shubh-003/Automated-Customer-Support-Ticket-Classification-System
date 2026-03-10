/*

Admin/Agent can view all support tickets.

API: GET /api/tickets/all
*/

import { useEffect, useState } from "react";
import axios from "../api/axiosClient";

function AdminTickets(){

  const [tickets,setTickets] = useState([]);

  const loadTickets = async () => {

    try {

      const res = await axios.get("/tickets/all");

      setTickets(res.data);

    } catch(err){

      console.error("Failed to load tickets");

    }
  };

  useEffect(()=>{
    loadTickets();
  },[]);

  return (

    <div className="p-6">

      <h2 className="text-xl mb-4">
        All Tickets
      </h2>

      {tickets.map((t)=>(
        <div
          key={t.id}
          className="border p-3 mb-3"
        >

          <h3 className="font-bold">
              User: {t.createdBy}
          </h3>

          <p> {t.subject}</p>

          <p>{t.description}</p>

          <p>Category: {t.category}</p>

          <p> confidence: {t.confidence} </p>

          <p>Status: {t.status}</p>

          <p> Created At: {t.createdAt} </p>


        </div>
      ))}

    </div>

  );
}

export default AdminTickets;