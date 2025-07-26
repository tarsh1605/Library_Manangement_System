import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { Link } from "react-router-dom";

const Register = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axiosInstance.post("/users/register", {
        username,
        password,
        role,
      });
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      if ((res.data.role = "admin")) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-200"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          REGISTER
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-6 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />

          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <label className="flex items-center mt-3 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              Show Password
            </label>
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium mt-6"
        >
          Create Account
        </button>

        <p className="text-sm mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
