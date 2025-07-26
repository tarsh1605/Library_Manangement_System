import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

const UserExploreBooks = () => {
  const axiosInstance = useAxios();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAddToCart = async (bookId) => {
    try {
      await axiosInstance.post("/cart/add", {
        bookId,
        quantity: 1,
      });
      showMessage("✅ Book added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      showMessage("❌ Failed to add book to cart");
    }
  };

  const fetchBooks = async (query = "") => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/books", {
        params: query ? { search: query } : {},
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Fetch books error:", err);
      showMessage("❌ Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks(search.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">📖 Explore Books</h2>

      <div className="sticky top-0 bg-white z-10 pb-4 mb-6">
        <div className="flex items-center justify-center gap-2">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border p-2 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearchSubmit}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>
      </div>

      <div className="h-10 mb-4">
        {message && (
          <div className="text-center text-sm text-blue-700 bg-blue-100 p-2 rounded">
            {message}
          </div>
        )}
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <p className="text-center mt-10">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-center text-gray-600">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white shadow rounded p-4 flex flex-col items-center"
              >
                <img
                  src={book.coverImage || "https://via.placeholder.com/100"}
                  alt={book.title}
                  className="w-32 h-48 object-cover rounded mb-2 hover:scale-105 transition"
                />
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-sm text-gray-500">
                  {book.availableCopies} / {book.totalCopies} available
                </p>
                <button
                  onClick={() => handleAddToCart(book._id)}
                  disabled={book.availableCopies === 0}
                  className={`mt-2 px-3 py-1 rounded text-white text-sm ${
                    book.availableCopies === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {book.availableCopies === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserExploreBooks;
