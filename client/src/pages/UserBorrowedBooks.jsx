import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

const UserBorrowedBooks = () => {
  const axiosInstance = useAxios();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        // console.log("YES");
        const res = await axiosInstance.get("/users/issued-books");
        setRecords(res.data);
      } catch (err) {
        console.error("Error fetching borrowed books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [axiosInstance]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading borrowed books...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        📘 Your Borrowed Books
      </h2>

      {records.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven't borrowed any books yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-white rounded shadow p-4 flex gap-4 items-center"
            >
              <img
                src={
                  record.book.coverImage || "https://via.placeholder.com/100"
                }
                alt={record.book.title}
                className="w-24 h-32 object-cover rounded hover:scale-105 transition"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{record.book.title}</h3>
                <p className="text-sm text-gray-600">
                  Author: {record.book.author}
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
                  <p className="text-sm text-yellow-600">Not yet returned</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBorrowedBooks;
