import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ links }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Hook to detect current URL path

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button (Visible only on small screens) */}
      <button
        onClick={toggleSidebar}
        className="mobile-menu-btn"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay (Clicking outside sidebar closes it) */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar-container ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="sidebar-header">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Support Desk
          </h2>
          {/* Close button inside sidebar for mobile users */}
          <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => {
            // Check if the current route matches the link's path to apply the glass effect
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)} // Auto-close on mobile after clicking a link
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;