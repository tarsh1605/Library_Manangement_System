import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";

const AddBook = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const res = await axiosInstance.post("/books", {
        title,
        author,
        totalCopies: parseInt(totalCopies),
        availableCopies: parseInt(totalCopies),
        coverImage: image,
        category,
      });

      setSuccess(true);
      setTitle("");
      setAuthor("");
      setImage("");
      setTotalCopies(1);
      setCategory("");
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add book";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Add New Book
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-800 p-3 mb-4 rounded text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-300 text-green-800 p-3 mb-4 rounded text-sm text-center">
              Book added successfully!
            </div>
          )}

          <form onSubmit={handleAddBook}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book Title
              </label>
              <input
                type="text"
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                placeholder="Enter author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Copies
              </label>
              <input
                type="number"
                min="0"
                placeholder="Number of copies"
                value={totalCopies}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setTotalCopies(e.target.value);
                  }
                }}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="Enter book category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/book-cover.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {image && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <img
                    src={image}
                    alt="Book cover preview"
                    className="w-24 h-36 object-cover rounded border border-gray-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-medium"
            >
              Add Book to Library
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
