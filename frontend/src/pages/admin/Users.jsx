import { useEffect, useState } from "react";
import { getUserStats } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await getUserStats();
      setUsers(data);
    };

    load();
  }, []);

  /*
  Redirect to search page
  */
  const viewTickets = (username) => {
    navigate(`/search?query=${username}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        Users Overview
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500 italic">No users found</p>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4 text-center">Total Tickets</th>
                <th scope="col" className="px-6 py-4 text-center">Resolved</th>
                <th scope="col" className="px-6 py-4 text-center">Unresolved</th>
                <th scope="col" className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={i}
                  className="bg-white border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {u.username}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold">
                    {u.totalTickets}
                  </td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">
                    {u.resolvedTickets}
                  </td>
                  <td className="px-6 py-4 text-center text-red-500 font-semibold">
                    {u.unresolvedTickets}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => viewTickets(u.username)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-sm transition-colors text-xs font-medium uppercase"
                    >
                      View Tickets
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Users;