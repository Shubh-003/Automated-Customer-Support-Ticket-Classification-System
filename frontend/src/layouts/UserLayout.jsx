/*
User dashboard layout.

Includes sidebar + page content.
*/

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function UserLayout() {

  const links = [
    { label: "Dashboard", path: "/user" },
    { label: "Create Ticket", path: "/user/create-ticket" },
    { label: "My Tickets", path: "/user/my-tickets" },
  ];

  return (
    <div className="flex">

      <Sidebar links={links} />

      <div className="flex-1">
        <Navbar />
       </div>
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}

export default UserLayout;