import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LogoutButton from "../components/LogoutButton";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            Admin Dashboard
          </div>
          <div className="flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/admin" className="hover:text-blue-600">
              Home
            </Link>
            <Link to="/admin/books" className="hover:text-blue-600">
              Books
            </Link>
            <Link to="/admin/books/new" className="hover:text-blue-600">
              Add Book
            </Link>
            <Link to="/admin/issued-books" className="hover:text-blue-600">
              Issued
            </Link>
            <Link to="/admin/users" className="hover:text-blue-600">
              Users
            </Link>
            <Link to="/admin/stats" className="hover:text-blue-600">
              Stats
            </Link>
            <Link to="/admin/fines" className="hover:text-blue-600">
              Fines
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pb-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
