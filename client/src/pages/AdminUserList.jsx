import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

const AdminUserList = () => {
  const axiosInstance = useAxios();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [axiosInstance]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">👥 All Users</h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-sm">
          ⚠️ {error}
        </div>
      )}

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {user.username}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                🔐 Role:{" "}
                <span
                  className={`font-medium ${
                    user.role === "admin" ? "text-blue-600" : "text-green-600"
                  }`}
                >
                  {user.role}
                </span>
              </p>
              <p className="text-gray-600 text-sm">
                📚 Books Issued:{" "}
                <span className="font-semibold">{user.issuedCount}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
