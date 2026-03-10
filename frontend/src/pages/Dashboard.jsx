/*
File: Dashboard.jsx

Purpose:
Main application dashboard.

Renders different UI depending on the user role.
*/

import { useAuth } from "../auth/AuthContext";

import CreateTicket from "./CreateTicket";
import MyTickets from "./MyTickets";
import AdminTickets from "./AdminTickets";

function Dashboard(){

  const { role } = useAuth();

  return (

    <div className="p-6">

      <h1 className="text-2xl mb-6">
        Dashboard
      </h1>

      {/* USER interface */}
      {role === "USER" && (
        <>
        <h1>Welcome USER</h1>
          <CreateTicket />
          <MyTickets />
        </>
      )}

      {/* AGENT interface */}
      {role === "AGENT" && (
          <>
        <AdminTickets />
        </>
      )}

      {/* ADMIN interface */}
      {role === "ADMIN" && (
          <>
          <h1>Welcome ADMIN</h1>
        <AdminTickets />
        </>
      )}

    </div>

  );
}

export default Dashboard;