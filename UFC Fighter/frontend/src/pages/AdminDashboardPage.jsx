import { useEffect, useState } from "react";
import api from "../api/client";

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setAnalytics(res.data));
  }, []);

  if (!analytics) return <div className="p-6">Loading admin analytics...</div>;
  const { kpis } = analytics;
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <div className="grid md:grid-cols-5 gap-3 mb-4">
        <div className="bg-white text-black p-3 rounded">Users: {kpis.totalUsers}</div>
        <div className="bg-white text-black p-3 rounded">Orders: {kpis.totalOrders}</div>
        <div className="bg-white text-black p-3 rounded">Revenue: ${kpis.totalRevenue}</div>
        <div className="bg-white text-black p-3 rounded">Products: {kpis.totalProducts}</div>
        <div className="bg-white text-black p-3 rounded">Fighters: {kpis.totalFighters}</div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
