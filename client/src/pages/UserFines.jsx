import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

const UserFines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const { data } = await axiosInstance.get("/fine/my");
        setFines(data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load fines");
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, [axiosInstance]);

  if (loading) return <p>Loading fines...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Fines</h2>
      {fines.length === 0 ? (
        <p>No fines found 🎉</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Book</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine._id}>
                <td className="p-2 border">{fine.book?.title}</td>
                <td className="p-2 border">₹{fine.amount}</td>
                <td className="p-2 border">{fine.paid ? "Paid" : "Unpaid"}</td>
                <td className="p-2 border">
                  {new Date(fine.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserFines;
