import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

const BookList = () => {
  const axiosInstance = useAxios();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBook, setEditBook] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axiosInstance.delete(`/books/${bookId}`);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      showSuccess("Book deleted successfully!");
    } catch (err) {
      console.error("Failed to delete book:", err);
      showError("Failed to delete the book.");
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axiosInstance.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch books", err);
        showError("Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [axiosInstance]);

  const handleInputChange = (field, value) => {
    setEditBook((prev) => ({
      ...prev,
      [field]:
        field === "totalCopies" || field === "availableCopies"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedBook = {
        ...editBook,
        totalCopies: Number(editBook.totalCopies),
        availableCopies: Number(editBook.availableCopies),
      };
      await axiosInstance.put(`/books/${editBook._id}`, updatedBook);
      setBooks((prev) =>
        prev.map((b) => (b._id === editBook._id ? updatedBook : b))
      );
      setEditBook(null);
      showSuccess("Book updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      showError("Failed to update book.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-600">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-6">📚 Library Collection</h1>
        <p className="text-gray-600">Manage your book collection</p>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 text-sm rounded bg-green-100 text-green-800">
          ✅ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 text-sm rounded bg-red-100 text-red-800">
          ⚠️ {errorMessage}
        </div>
      )}

      {editBook && (
        <div className="mb-6 bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-4">✏️ Edit Book</h2>

          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={editBook.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                value={editBook.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={editBook.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Total Copies
              </label>
              <input
                type="number"
                value={editBook.totalCopies ?? ""}
                onChange={(e) =>
                  handleInputChange("totalCopies", e.target.value)
                }
                className="w-full border p-2 rounded"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Available Copies
              </label>
              <input
                type="number"
                value={editBook.availableCopies ?? ""}
                onChange={(e) =>
                  handleInputChange("availableCopies", e.target.value)
                }
                className="w-full border p-2 rounded"
                min={0}
                max={editBook.totalCopies ?? undefined}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                value={editBook.coverImage}
                onChange={(e) =>
                  handleInputChange("coverImage", e.target.value)
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                💾 Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditBook(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded shadow p-4 flex gap-4 items-center"
          >
            <img
              src={book.coverImage || "https://via.placeholder.com/100"}
              alt={book.title}
              className="w-24 h-32 object-cover rounded hover:scale-105 transition"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-sm text-gray-600">Author: {book.author}</p>
              <p className="text-sm text-gray-600">Category: {book.category}</p>
              <p className="text-sm text-gray-700">
                Copies: {book.availableCopies} / {book.totalCopies}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setEditBook(book)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
