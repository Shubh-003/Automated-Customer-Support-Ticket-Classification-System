import { useEffect, useState } from "react";
import { getAuditLogs } from "../../api/auditApi";

function Audit() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getAuditLogs();
        setLogs(data || []);
      } catch (error) {
        console.error("Failed to load audit logs", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Helper to colorize specific actions (CREATE, UPDATE, DELETE, etc.)
  const getActionClass = (action) => {
    if (!action) return "action-default";
    const act = action.toUpperCase();
    if (act.includes("CREATE") || act.includes("ADD")) return "action-create";
    if (act.includes("UPDATE") || act.includes("EDIT")) return "action-update";
    if (act.includes("DELETE") || act.includes("REMOVE")) return "action-delete";
    if (act.includes("LOGIN") || act.includes("AUTH")) return "action-login";
    return "action-default";
  };

  // Helper to split date and time for cleaner UI
  const formatDateTime = (timestamp) => {
    if (!timestamp) return { date: "N/A", time: "" };
    const d = new Date(timestamp);
    return {
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Security & Audit Logs</h2>
          <p className="text-slate-500 text-sm mt-1">
            Monitor system activity, user actions, and security events.
          </p>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="table-wrapper p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-100 rounded w-full"></div>
            <div className="h-12 bg-slate-100 rounded w-full"></div>
            <div className="h-12 bg-slate-100 rounded w-full"></div>
            <div className="h-12 bg-slate-100 rounded w-full"></div>
          </div>
        </div>
      ) : logs.length === 0 ? (

        /* EMPTY STATE */
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-sm font-medium text-slate-900">No audit logs found</h3>
          <p className="mt-1 text-sm text-slate-500">System events will be recorded here.</p>
        </div>

      ) : (
        <div className="space-y-4">

          {/* MOBILE VIEW: Stacked Cards (< 768px) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {logs.map((log) => {
              const { date, time } = formatDateTime(log.timestamp);
              const isSuccess = log.status === "SUCCESS";

              return (
                <div key={log.id} className="log-mobile-card">
                  {/* Status Indicator Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                  <div className="pl-2 flex justify-between items-start">
                    <div>
                      <span className={`badge-action ${getActionClass(log.action)} mb-2`}>
                        {log.action}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {log.entity_name} <span className="text-slate-500 font-normal">#{log.entityId}</span>
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-900">{date}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{time}</p>
                    </div>
                  </div>

                  <div className="pl-2 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span className="font-semibold text-slate-700">{log.username}</span>
                      <span className="opacity-75">({log.role})</span>
                    </div>
                    <span className="font-mono text-[10px]">{log.ipAddress}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP VIEW: Consolidated Table (>= 768px) */}
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col" className="admin-th w-48">Timestamp</th>
                  <th scope="col" className="admin-th">Actor</th>
                  <th scope="col" className="admin-th">Event</th>
                  <th scope="col" className="admin-th">Target Entity</th>
                  <th scope="col" className="admin-th text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const { date, time } = formatDateTime(log.timestamp);
                  const isSuccess = log.status === "SUCCESS";

                  return (
                    <tr key={log.id} className="admin-tr">
                      {/* 1. Timestamp (Split date/time) */}
                      <td className="admin-td">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">{date}</span>
                          <span className="text-xs font-mono text-slate-500">{time}</span>
                        </div>
                      </td>

                      {/* 2. Actor (Combined User, Role, and IP) */}
                      <td className="admin-td">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-bold text-slate-800">{log.user_name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{log.role}</span>
                          </div>
                          <span className="text-xs font-mono text-slate-400">IP: {log.ipAddress}</span>
                        </div>
                      </td>

                      {/* 3. Event Action */}
                      <td className="admin-td">
                        <span className={`badge-action ${getActionClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>

                      {/* 4. Target Entity (Combined Name and ID) */}
                      <td className="admin-td">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">{log.entity_name}</span>
                          <span className="text-xs font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            #{log.entity_id}
                          </span>
                        </div>
                      </td>

                      {/* 5. Status */}
                      <td className="admin-td text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`} title={log.status}>
                          {isSuccess ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}

export default Audit;