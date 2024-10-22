import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "./Context/UserContext"; // Import user context

const Auth = ({ setIsLoggedIn, onSuccess, onError }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const { setUserId, setToken } = useUser(); // Get the context functions

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are present based on whether the user is registering or logging in
    if (isLogin) {
      if (!email || !password) {
        toast.error("Email and password are required!");
        return;
      }
    } else {
      // If not logging in, we need username as well
      if (!email || !password || !username) {
        toast.error("All fields are required!");
        return;
      }
    }

    const url = isLogin
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/register";

    // Prepare the body according to the request type
    const body = isLogin ? { email, password } : { username, email, password }; // Include username for registration

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Success!");

        // Save userId and token to global context if available
        if (data.id) setUserId(data.id);
        if (data.token) setToken(data.token);

        setIsLoggedIn(true);
        onSuccess();
        navigate("/update-profile"); // Navigate to profile update after registration
      } else {
        // Display error messages based on backend response
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isLogin ? "Login" : "Register"}
          </button>
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
