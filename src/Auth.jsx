import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "./Context/UserContext";
import Cookies from "js-cookie";
import { Toaster, toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../api/axiosInstance";
import axios from "axios";

const Auth = ({ isLogin = true, setIsLoggedIn, onSuccess, onError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("job applicant");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserId, setToken } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"; 
      const { data } = await api.post(endpoint, { email, password, username, role });

      setUserId(data.id);
      setToken(data.token);

      if (data.role === "nurse") {
        navigate("/NurseForm");
      } else {
        navigate("/profile");
      }

      if (typeof onSuccess === "function") onSuccess(); 
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors) {
        data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error(data?.message || "Something went wrong!");
      }

      if (typeof onError === "function") onError();
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Signup"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Full Names i.e John Doe"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none bg-gray-50 text-gray-700"
              />
              <label className="block text-sm font-medium text-gray-700">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none bg-gray-50 text-gray-700"
                required
              >
                <option value="nurse">Nurse</option>
                <option value="job applicant">Other roles</option>
              </select>
            </>
          )}
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
          />
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {!isLogin && (
            <>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
              />
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Signup"}
          </button>
          <Link to="/forgetPassword" className="flex text-blue-500 hover:underline justify-center">
            Forgot Password
          </Link>
        </form>
        <p className="text-center mt-4">
          {isLogin ? (
            <Link to="/register" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          ) : (
            <Link to="/auth" className="text-blue-500 hover:underline">
              Already have an account? Login
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;