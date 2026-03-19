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
    /* Added min-h-screen and a subtle bg-slate-50 for consistent enterprise styling */
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">

      <Sidebar links={links} />

      {/* MAIN CONTENT WRAPPER
        The magic happens here with md:ml-64.
        On mobile, there's no margin. On desktop (md), it pushes the content right by 16rem (64 units)
        so it perfectly aligns next to the fixed sidebar.
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

export default UserLayout;