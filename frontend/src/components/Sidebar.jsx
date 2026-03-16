import { Link } from "react-router-dom";

function Sidebar({ links }) {

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">

      <h2 className="text-xl mb-6 font-bold">
        Support Desk
      </h2>

      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="block mb-3 hover:text-gray-300"
        >
          {link.label}
        </Link>
      ))}

    </div>
  );
}

export default Sidebar;