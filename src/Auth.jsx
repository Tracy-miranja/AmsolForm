import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./Context/UserContext"; // Import user context
import { FiEye, FiEyeOff } from "react-icons/fi"; // Eye icons for password toggle
import Cookies from "js-cookie"; // Import js-cookie

const Auth = ({ setIsLoggedIn, onSuccess, onError }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { setUserId, setToken, userId } = useUser();

  // Check if user is already logged in
  useEffect(() => {
    const savedToken = Cookies.get("authToken");
    const savedUserId = Cookies.get("userId");

    if (savedToken && savedUserId) {
      setUserId(savedUserId);
      setToken(savedToken);
      setIsLoggedIn(true);
      navigate("/Formlayout");
    }
  }, [setUserId, setToken, setIsLoggedIn, navigate]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!email || !password) {
        toast.error("Email and password are required!");
        return;
      }
    } else {
      if (!email || !password || !username || !confirmPassword) {
        toast.error("All fields are required!");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
    }

    const url = isLogin
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/register";

    const body = isLogin
      ? { email, password }
      : { username, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Success!");
        if (data.id) {
          setUserId(data.id);
          Cookies.set("userId", data.id);
        }
        if (data.token) {
          setToken(data.token);
          Cookies.set("authToken", data.token, { expires: 7 });
        }
        setIsLoggedIn(true);
        onSuccess();
        navigate("/Formlayout");
      } else {
        const errorMessages = data.errors
          ? data.errors.map((error) => error.msg).join(", ")
          : data.message || "Error occurred";
        toast.error(errorMessages);
        onError();
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again later.");
      onError();
    }
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");
    setUserId(null);
    setToken(null);
    setIsLoggedIn(false);
    navigate("/");
    toast.success("Logged out successfully!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-50">
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <h2 className="text-2xl mb-6 text-center text-blue-600">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required={!isLogin}
            />
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-10"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {!isLogin && (
          <div className="mb-6 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-10"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isLogin ? "Login" : "Register"}
          </button>
          
          {isLogin && (
            <Link to="/forgetPassword" className="text-blue-500">
              Forget Password?
            </Link>
          )}
        </div>

        <div className="mt-4 text-center">
          <span className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          </span>
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
