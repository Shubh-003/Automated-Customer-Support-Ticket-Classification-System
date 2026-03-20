import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout() {

  const links = [
    { label: "Dashboard", path: "/admin" },
    { label: "Tickets", path: "/admin/tickets" },
    { label: "Users", path: "/admin/users" },
//     { label: "Audit-logs", path: "/admin/Audit" },
  ];

  return (
    /* Added bg-slate-50 for a professional contrast against white cards/nav */
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">

      <Sidebar links={links} />

      {/* MAIN CONTENT WRAPPER
        md:ml-64 applies a left margin of 16rem only on medium screens and up,
        preventing the content from hiding under the fixed sidebar.
      */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 transition-all duration-300">

        <Navbar />

        {/* PAGE CONTENT WRAPPER
          Using semantic <main> tag and flexible padding based on screen size
        */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;