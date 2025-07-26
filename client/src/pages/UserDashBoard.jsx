import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LogoutButton from "../components/LogoutButton";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "customer") {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-6">
              <Link to="/user" className="text-xl font-bold text-slate-700">
                📚 LibrarySys
              </Link>

              <Link
                to="/user"
                className={`text-sm font-medium ${
                  location.pathname === "/user"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Home
              </Link>

              <Link
                to="explore-books"
                className={`text-sm font-medium ${
                  location.pathname.includes("explore-books")
                    ? "text-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                Explore Books
              </Link>

              <Link
                to="borrowed-books"
                className={`text-sm font-medium ${
                  location.pathname.includes("borrowed-books")
                    ? "text-yellow-600"
                    : "text-gray-600 hover:text-yellow-600"
                }`}
              >
                Borrowed Books
              </Link>

              <Link
                to="cart"
                className={`text-sm font-medium ${
                  location.pathname.includes("cart")
                    ? "text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                View Cart
              </Link>

              <Link
                to="fines"
                className={`text-sm font-medium ${
                  location.pathname.includes("fines")
                    ? "text-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                My Fines
              </Link>
            </div>

            <div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default UserDashboard;
