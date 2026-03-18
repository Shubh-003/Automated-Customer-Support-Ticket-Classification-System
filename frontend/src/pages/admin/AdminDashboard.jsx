import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/dashboardApi";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";

function AdminDashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getDashboardStats();
      setData(res);
    };
    load();
  }, []);

  if (!data) return <p>Loading...</p>;

  // Convert maps to arrays for charts
  const categoryData = Object.entries(data.ticketsByCategory)
    .map(([key, value]) => ({ name: key, value }));

  const statusData = Object.entries(data.ticketsByStatus)
    .map(([key, value]) => ({ name: key, value }));

  const trendData = Object.entries(data.dailyTrends)
    .map(([date, count]) => ({ date, count }));

  return (
    <div className="p-6 space-y-8">

      {/* TOP STATS */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h2>Total Tickets</h2>
          <p className="text-2xl font-bold">{data.totalTickets}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2>Total Users</h2>
          <p className="text-2xl font-bold">{data.totalUsers}</p>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="mb-4 font-bold">Tickets by Category</h2>

        <BarChart width={500} height={300} data={categoryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>

      {/* PIE CHART */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="mb-4 font-bold">Tickets by Status</h2>

        <PieChart width={400} height={300}>
          <Pie
            data={statusData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {statusData.map((_, i) => (
              <Cell key={i} />
            ))}
          </Pie>
        </PieChart>
      </div>

      {/* LINE CHART */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="mb-4 font-bold">Daily Trends</h2>

        <LineChart width={600} height={300} data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" />
        </LineChart>
      </div>

    </div>
  );
}

export default AdminDashboard;