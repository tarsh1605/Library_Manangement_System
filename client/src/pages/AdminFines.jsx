import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

const AdminFines = () => {
  const [fines, setFines] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [error, setError] = useState("");
  const axiosInstance = useAxios();

  const fetchFines = async () => {
    try {
      const res = await axiosInstance.get("/fine", {
        params: searchUser ? { username: searchUser } : {},
      });
      setFines(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch fines");
    }
  };

  const markAsPaid = async (id) => {
    try {
      await axiosInstance.patch(`/fine/pay/${id}`);
      fetchFines();
    } catch (err) {
      alert("Error marking fine as paid");
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Fines</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by username"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full max-w-sm"
        />
        <button
          onClick={fetchFines}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">User</th>
              <th className="p-3">Book</th>
              <th className="p-3">Amount (₹)</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fines.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No fines found.
                </td>
              </tr>
            ) : (
              fines.map((fine) => (
                <tr key={fine._id} className="border-t">
                  <td className="p-3">{fine.user?.username}</td>
                  <td className="p-3">{fine.book?.title}</td>
                  <td className="p-3">{fine.amount}</td>
                  <td className="p-3">
                    {fine.paid ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                  <td className="p-3">
                    {!fine.paid && (
                      <button
                        onClick={() => markAsPaid(fine._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFines;
