import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateCV = () => {
  const [cvFile, setCvFile] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  // Fetch the userId by checking auth status
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get("/Api/checkAuth", {
          withCredentials: true,
        });

        // Check if the user is authenticated
        if (
          response.status === 200 &&
          response.data.message === "Authenticated"
        ) {
          const userResponse = await axios.get("/Api/getUserId", {
            withCredentials: true,
          });
          console.log(userResponse.data);
          if (userResponse.status === 200) {
            setUserId(userResponse.data.userId); // Assuming userId is returned here
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
        `http://localhost:5000/Api/users/${userId}/cv`,
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

  return (
    <div>
      <h2>Update Your CV</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
        <button type="submit">Update CV</button>
      </form>
      <div>
        {message && <p>{message}</p>}
        {userId ? <p>User ID: {userId}</p> : <p>Loading user ID...</p>}
      </div>
    </div>
  );
};

export default UpdateCV;
