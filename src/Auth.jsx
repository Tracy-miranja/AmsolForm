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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserId, setToken } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = Cookies.get("token");
    if (token) {
      // Redirect to the form layout if the token exists
      navigate("/Formlayout");
    }
  }, [navigate]);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
<<<<<<< HEAD
  
    setLoading(true);
  
=======

    const url = isLogin
      ? "https://amsol-api.onrender.com/api/login"
      : "https://amsol-api.onrender.com/api/register";

    const body = isLogin ? { email, password } : { username, email, password };

>>>>>>> ee348076dcdd38e81e0d94ce250c05fd635bcef0
    try {
      const endpoint = isLogin
        ? "https://amsol-api.onrender.com/api/login"
        : "https://amsol-api.onrender.com/api/register";
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });
  
      const data = await response.json();
      console.log(data)
      setLoading(false);
  
      if (response.ok) {
        if (isLogin) {
          // On login, store token and navigate to the form layout
          Cookies.set("token", data.token, { expires: 7 });
          
          setUserId(data.id);
          setToken(data.token);
          onSuccess();
          navigate("/profile"); // Redirect after login
        } else {
          // On signup, redirect to login page with a success message
          toast.success("Signup successful! Please login.");
          navigate("/auth"); // Redirect to login page
        }
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
        onError(); // Call onError if it's a function
      }
      toast.error("Failed to connect to the server!");
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
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
<<<<<<< HEAD
        </form>
        <p className="text-center mt-4">
          {isLogin ? (
            <Link to="/register" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          ) : (
            <Link to="/auth" className="text-blue-500 hover:underline">
              Already have an account? Login
=======

          {isLogin && (
            <Link to="/forgetPassword" className="text-blue-500">
              Forget Password?
>>>>>>> ee348076dcdd38e81e0d94ce250c05fd635bcef0
            </Link>
          )}
        </p>
       
      </div>
    </div>
  );
};

export default Auth;
