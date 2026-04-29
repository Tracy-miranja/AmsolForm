import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { Link } from "react-router-dom";

const UpdateCV = () => {
  const [cvFile, setCvFile] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(""); // To store user ID after fetching
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to fetch user ID after login
  // Fetch user ID from cookie-stored session
const fetchUserId = async () => {
  try {
    const response = await axios.get("https://amsol-api-production.up.railway.app/api/users/me", {
      withCredentials: true, // Ensure cookies are sent with the request
    });

    if (response.status === 200) {
      const userData = response.data;
      setUserId(userData.userId); // Assuming API returns userId based on cookie
      console.log("User ID:", userData.userId);
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};


  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!cvFile) {
      setMessage("Please select a CV to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);

    // Check userId before making the request
    console.log("User ID:", userId); // Log to check if userId is set

    try {
      const response = await axios.put(
        `https://amsol-api-production.up.railway.app/api/users/${userId}/cv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setMessage(response.data.message); 
    } catch (error) {
      console.error("Error updating CV:", error);
      setMessage("Failed to update CV.No user found.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://amsol-api-production.up.railway.app/api/auth/login", {
        email,
        password,
      }, { withCredentials: true });

      if (response.status === 200) {
        setIsLoggedIn(true);
        setMessage("Login successful!");

        // Fetch user ID immediately after successful login
        await fetchUserId();
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Failed to login. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-blue-400 text-white p-2">
        <Link className="text-white p-6" to="/">Home</Link>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Update Your CV</h2>
          {isLoggedIn ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Update CV
              </button>
              {message && <p className="text-center text-red-500">{message}</p>}
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Login
              </button>
              {message && <p className="text-center text-green-500">{message}</p>}
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateCV;
