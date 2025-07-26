import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

const AdminStats = () => {
  const axiosInstance = useAxios();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load admin statistics.");
        console.error(err);
      }
    };

    fetchStats();
  }, [axiosInstance]);

  if (error) {
    return (
      <div className="text-red-600 text-center mt-8 font-semibold">
        ❌ {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-gray-600 text-center mt-8">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        📊 Admin Statistics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="👥 Total Users" value={stats.totalUsers} />
        <StatCard label="🛡️ Admins" value={stats.totalAdmins} />
        <StatCard label="📖 Customers" value={stats.totalCustomers} />
        <StatCard label="📚 Total Books" value={stats.totalBooks} />
        <StatCard
          label="📦 Available Copies"
          value={stats.totalAvailableCopies}
        />
        <StatCard label="📝 Total Issued Records" value={stats.totalIssued} />
        <StatCard label="📕 Currently Issued" value={stats.currentlyIssued} />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-gray-100 hover:bg-gray-200 p-4 rounded shadow text-center transition">
    <p className="text-sm text-gray-600">{label}</p>
    <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
  </div>
);

export default AdminStats;
