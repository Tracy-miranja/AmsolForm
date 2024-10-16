import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import logo from "./assets/amsolJobVacancies.png";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

  const getUserDetails = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setMessage("");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, include at least one letter, one number, and one special character."
      );
      setMessage("");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        email,
        password,
        role: "job applicant", // Default role assigned
      });

      setMessage(response.data.message);
      setEmail("");
      setPassword("");
      setUserName("");
      setConfirmPassword("");
      setError("");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
        setMessage("");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="w-full h-[50px] bg-gradient-to-r from-[#25b2e6] to-blue-500 flex items-center justify-around shadow-2xl p-8 text-white gap-5">
        <div className="bg-white rounded-full w-[200px] flex items-center justify-center">
          <img src={logo} alt="hrOutsourcing" className="w-[110px] p-1" />
        </div>
        <div className="flex items-center gap-5">
          <Link className="text-white flex gap-2" to="/">
            <FaHome className="mt-1" /> Home
          </Link>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="flex text-center justify-center p-6">
        <h3 className="font-bold">Welcome to AMSOL, sign up to start your journey here</h3>
      </div>

      {/* Signup Form */}
      <div className="flex justify-center h-screen p-6">
        <div className="flex flex-col w-[50%] p-6 rounded-lg shadow-lg h-fit">
          <h3 className="text-2xl font-semibold mb-4">Create Your Personal Account</h3>
          <form className="flex flex-col text-sm" onSubmit={getUserDetails}>
            {/* Username Input */}
            <div>
              <label>
                <span className="font-bold">Username</span> <span className="text-red-500">*</span>:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  placeholder="Enter Username"
                  className="ml-2 w-full p-2 rounded border border-gray-300 focus:border-blue-500"
                />
              </label>
            </div>

            {/* Email Input */}
            <div>
              <label>
                <span className="font-bold">Email</span> <span className="text-red-500">*</span>:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter Email"
                  className="ml-2 w-full p-2 rounded border border-gray-300 focus:border-blue-500"
                />
              </label>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label>
                <span className="font-bold">Password</span> <span className="text-red-500">*</span>:
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter Password"
                  className="ml-2 w-full p-2 rounded border border-gray-300 focus:border-blue-500"
                />
                <span
                  className="absolute right-3 top-[30%] cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </label>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <label>
                <span className="font-bold">Confirm Password</span> <span className="text-red-500">*</span>:
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                  className="ml-2 w-full p-2 rounded border border-gray-300 focus:border-blue-500"
                />
                <span
                  className="absolute right-3 top-[30%] cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </label>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 mt-4"
            >
              Sign Up
            </button>

            {/* Success/Error Messages */}
            {message && <p className="mt-4 text-green-500">{message}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            <p className="mt-4">
              Already have an account? <Link to="/login" className="text-blue-800 hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
