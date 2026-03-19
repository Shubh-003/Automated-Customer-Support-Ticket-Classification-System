import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/dashboardApi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend
} from "recharts";

function AdminDashboard() {
  const [data, setData] = useState(null);

  // Enterprise Color Palette for charts
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDashboardStats();
        setData(res);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    load();
  }, []);

  if (!data) {
    // Professional Loading Skeleton
    return (
      <div className="p-4 md:p-6 space-y-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="loading-pulse h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="loading-pulse h-[400px]" />
           <div className="loading-pulse h-[400px]" />
        </div>
      </div>
    );
  }

  // Data preparation
  const categoryData = Object.entries(data.ticketsByCategory || {})
    .map(([key, value]) => ({ name: key, value }));

  const statusData = Object.entries(data.ticketsByStatus || {})
    .map(([key, value]) => ({ name: key, value }));

  const trendData = Object.entries(data.dailyTrends || {})
    .map(([date, count]) => ({ date, count }));

  // Common Tooltip Style for enterprise look
  const customTooltipStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    color: '#1e293b'
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
        <p className="text-slate-500">Real-time support desk analytics and metrics.</p>
      </div>

      {/* TOP STATS - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <h2 className="stat-card-title">Total Tickets</h2>
          <p className="stat-card-value text-indigo-600">{data.totalTickets || 0}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-card-title">Total Users</h2>
          <p className="stat-card-value text-emerald-600">{data.totalUsers || 0}</p>
        </div>
        {/* You can easily add more stats here later, e.g., Unresolved or Avg Response Time */}
      </div>

      {/* CHARTS ROW 1: Bar & Pie Side-by-Side on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

{/*  dataKey="name"   and  dataKey="value"  */}
        {/* BAR CHART */}
        <div className="chart-card h-[400px]">
          <h2 className="chart-title">Tickets by Category</h2>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* Removed vertical lines for a cleaner look */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>



        {/* PIE CHART */}
        <div className="chart-card h-[400px]">
          <h2 className="chart-title">Tickets by Status</h2>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80} // Converted to Donut chart for modern look
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>



      {/* CHARTS ROW 2: Full Width Line Chart */}
      <div className="chart-card h-[450px]">
        <h2 className="chart-title">Daily Ticket Volume Trends</h2>
        <div className="flex-1 w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;