import { useEffect, useState } from "react";
import { getUserStats } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getUserStats();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const viewTickets = (username) => {
    navigate(`/search?query=${username}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Directory</h2>
          <p className="text-slate-500 text-sm mt-1">
            Monitor user activity and ticket submission volumes.
          </p>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="table-wrapper p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 rounded w-full"></div>
            <div className="h-10 bg-slate-200 rounded w-full"></div>
            <div className="h-10 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      ) : users.length === 0 ? (
        /* EMPTY STATE */
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">No users found</h3>
          <p className="mt-1 text-sm text-slate-500">User statistics will appear here once they submit tickets.</p>
        </div>
      ) : (
        /* DATA CONTAINER */
        <div className="space-y-4">

          {/* MOBILE VIEW: Cards (Visible < 768px) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {users.map((u, i) => (
              <div key={i} className="user-mobile-card">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900 text-lg">{u.username}</span>
                  </div>
                  <button onClick={() => viewTickets(u.username)} className="btn-primary-sm">
                    View
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Total</p>
                    <span className="stat-badge stat-neutral">{u.totalTickets}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Resolved</p>
                    <span className="stat-badge stat-success">{u.resolvedTickets}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Unresolved</p>
                    <span className="stat-badge stat-danger">{u.unresolvedTickets}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Table (Visible >= 768px) */}
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col" className="admin-th w-1/3">User Details</th>
                  <th scope="col" className="admin-th text-center">Total Tickets</th>
                  <th scope="col" className="admin-th text-center">Resolved</th>
                  <th scope="col" className="admin-th text-center">Unresolved</th>
                  <th scope="col" className="admin-th text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} className="admin-tr group">
                    <td className="admin-td">
                      <div className="flex items-center gap-3">

                        <span className="font-semibold text-slate-900">{u.username}</span>
                      </div>
                    </td>
                    <td className="admin-td text-center">
                      <span className="stat-badge stat-neutral">{u.totalTickets}</span>
                    </td>
                    <td className="admin-td text-center">
                      <span className="stat-badge stat-success">{u.resolvedTickets}</span>
                    </td>
                    <td className="admin-td text-center">
                      <span className="stat-badge stat-danger">{u.unresolvedTickets}</span>
                    </td>
                    <td className="admin-td text-center">
                      <button
                        onClick={() => viewTickets(u.username)}
                        className="btn-primary-sm"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        View Tickets
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}

export default Users;