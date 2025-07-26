import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

const AdminIssuedBooks = () => {
  const axiosInstance = useAxios();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [message, setMessage] = useState("");

  const fetchRecords = async (userQuery = "", titleQuery = "") => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/issued-books", {
        params: {
          ...(userQuery && { search: userQuery }),
          ...(titleQuery && { title: titleQuery }),
        },
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch issued records", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecords(searchUser, searchTitle);
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Mark this book as returned?")) return;
    try {
      const res = await axiosInstance.put(`/issue/return/${id}`);
      setRecords((prev) =>
        prev.map((r) => (r._id === id ? res.data.issue : r))
      );
      setMessage("✅ Book marked as returned");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Return failed:", err);
      setMessage("❌ Failed to mark as returned");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📄 All Issued Records (Admin)
      </h2>

      <form
        onSubmit={handleSearch}
        className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
      >
        <input
          type="text"
          placeholder="Search by username"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Search by book title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          🔍 Search
        </button>
      </form>

      {message && (
        <div className="text-center text-sm mb-4 text-blue-700 bg-blue-100 p-2 rounded">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading records...</p>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-500">No issued records found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-white rounded shadow p-4 flex gap-4 items-center"
            >
              <img
                src={
                  record.book?.coverImage || "https://via.placeholder.com/100"
                }
                alt={record.book?.title}
                className="w-24 h-32 object-cover rounded hover:scale-105 transition"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {record.book?.title || "Unknown Book"}
                </h3>
                <p className="text-sm text-gray-600">
                  Author: {record.book?.author || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  Borrowed by:{" "}
                  <span className="font-medium text-blue-700">
                    {record.user?.username || "Unknown User"}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  Due:{" "}
                  {new Date(record.dueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                {record.returnedAt ? (
                  <>
                    <p className="text-sm text-green-600">
                      Returned:{" "}
                      {new Date(record.returnedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {record.fineAmount > 0 && (
                      <p className="text-sm text-red-600 font-medium">
                        Fine: ₹{record.fineAmount}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm text-yellow-600 font-medium">
                      Not yet returned
                    </p>
                    <button
                      onClick={() => handleReturn(record._id)}
                      className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                    >
                      ✅ Mark as Returned
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminIssuedBooks;
