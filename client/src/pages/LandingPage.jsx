import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md text-center hover:shadow-xl transition-shadow duration-300">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Library Portal
        </h1>

        <p className="text-gray-600 mb-8">
          Access your library resources anytime, anywhere.
        </p>

        <div className="space-y-3">
          <Link
            to="/login"
            className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
