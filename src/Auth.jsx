import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "./Context/UserContext";
import Cookies from "js-cookie";
import { Toaster, toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
      navigate("/Formlayout");
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
      const endpoint = isLogin
        ? "https://amsol-api.onrender.com/api/login"
        : "https://amsol-api.onrender.com/api/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username, role }), 
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Cookies.set("token", data.token, { expires: 7 });
        setUserId(data.id);
        setToken(data.token);

        if (data.role === "nurse") {
          navigate("/NurseForm");
        } else {
          navigate("/Formlayout");
        }
        onSuccess();
      } else {
        if (data.errors) {
          data.errors.forEach((error) => toast.error(error.msg));
        } else {
          toast.error(data.message || "Something went wrong!");
        }
      }
    } catch (error) {
      setLoading(false);
      if (typeof onError === "function") {
        onError();
      }
      // toast.error("Failed to connect to the server!");
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
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
              
              <select
                id="role"
                name="role" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                required
              >
              <option value="nurse">Nurse</option>
              <option value="job applicant">Other roles</option>
                
              </select>
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Signup"}
          </button>
          <Link to="/forgetPassword" className="flex text-blue-500 hover:underline justify-center">
              ForgetPassword
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
