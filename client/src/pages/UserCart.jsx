import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

const UserCart = () => {
  const axiosInstance = useAxios();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get("/cart");
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to fetch cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [axiosInstance]);

  const updateQuantity = async (bookId, quantity) => {
    try {
      const res = await axiosInstance.put("/cart", {
        bookId,
        quantity,
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to update cart item:", err);
      setError("Failed to update quantity.");
    }
  };

  const removeItem = async (bookId) => {
    try {
      const res = await axiosInstance.put("/cart", {
        bookId,
        quantity: 0,
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError("Failed to remove item.");
    }
  };

  const handleBorrow = async () => {
    try {
      setMessage("");
      setError("");
      const res = await axiosInstance.post("/users/borrow");
      setMessage(res.data.message);
      setCartItems([]);
    } catch (err) {
      console.error("Borrow failed:", err);
      setError(err.response?.data?.message || "Borrow failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">🛒 Your Cart</h2>

      {message && (
        <div className="mb-4 p-3 text-sm bg-green-100 text-green-800 rounded">
          ✅ {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 text-sm bg-red-100 text-red-800 rounded">
          ⚠️ {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cartItems.map((item) => (
              <div
                key={item.book._id}
                className="bg-white rounded shadow p-4 flex gap-4 items-center"
              >
                <img
                  src={
                    item.book.coverImage || "https://via.placeholder.com/100"
                  }
                  alt={item.book.title}
                  className="w-24 h-32 object-cover rounded hover:scale-105 transition"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.book.title}</h3>
                  <p className="text-sm text-gray-600">
                    Author: {item.book.author}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-sm text-gray-700">Quantity:</label>
                    <input
                      type="number"
                      value={item.quantity}
                      min={0}
                      max={item.book.availableCopies}
                      onChange={(e) =>
                        updateQuantity(item.book._id, Number(e.target.value))
                      }
                      className="w-16 p-1 border rounded"
                    />
                    <button
                      onClick={() => removeItem(item.book._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleBorrow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded"
            >
              ✅ Borrow All Books
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCart;
