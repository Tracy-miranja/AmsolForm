import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UpdateCV = () => {
  const [cvFile, setCvFile] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch the userId by checking auth status
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get("/Api/checkAuth", {
          withCredentials: true,
        });

        // Check if the user is authenticated
        if (response.status === 200 && response.data.message === "Authenticated") {
          const userResponse = await axios.get("/Api/getUserId", {
            withCredentials: true,
          });
          console.log(userResponse.data);
          if (userResponse.status === 200) {
            setUserId(userResponse.data.userId); // Assuming userId is returned here
            setIsLoggedIn(true); // Set login status to true
          } else {
            setMessage("Failed to fetch user ID.");
          }
        } else {
          setMessage("Unauthorized access");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setMessage("Failed to authenticate.");
      }
    };

    fetchUserId();
  }, []);

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
        `http://localhost:5000/api/users/${userId}/cv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setMessage(response.data.message); // Display success message
    } catch (error) {
      console.error("Error updating CV:", error);
      setMessage("Failed to update CV. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      }, { withCredentials: true });

      if (response.status === 200) {
        setIsLoggedIn(true);
        setMessage("Login successful!");
        // Optionally, fetch user ID here
        const userResponse = await axios.get("/api/getUserId", {
          withCredentials: true,
        });
        if (userResponse.status === 200) {
          setUserId(userResponse.data.userId);
        }
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
    <div className="bg-blue-400 text-white p-2"><Link className="text-white p-6" to="/">Home</Link></div>
  
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Update Your CV</h2>
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
            {message && <p className="text-center text-red-500">{message}</p>}
          </form>
        )}
      </div>
    </div>
    </>
  );
};

export default UpdateCV;
