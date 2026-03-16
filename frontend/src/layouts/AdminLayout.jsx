/*
Admin dashboard layout.
Includes sidebar navigation for admin features.
*/

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout() {

  const links = [
    { label: "Dashboard", path: "/admin" },
    { label: "Tickets", path: "/admin/tickets" },
    { label: "Users", path: "/admin/users" },
    { label: "Categories", path: "/admin/categories" },
  ];

  return (
    <div className="flex">

      <Sidebar
            links={links}
      />

      <div className="flex-1">
        <Navbar />
      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;