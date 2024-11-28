import React, { useState } from "react";
import { useUser } from "../Context/UserContext";

const Profile = ({ userCV = null }) => {
  const [cvFileId, setCvFileId] = useState(userCV); // Initialize with existing CV ID
  const [newCvFile, setNewCvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get userId and token from context
  const { userId, token } = useUser();

  // Handle CV file upload
  const handleUploadCv = async () => {
    if (!newCvFile) {
      alert("Please select a CV file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", newCvFile);

    try {
      setIsUploading(true);
      const response = await fetch(`http://localhost:5000/api/applications/cv/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCvFileId(data.cvId); // Update CV ID after upload
        alert("CV uploaded successfully!");
      } else {
        const error = await response.json();
        alert(`Error uploading CV: ${error.message}`);
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("An error occurred while uploading the CV.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle CV file download
  const handleDownloadCv = async () => {
    if (!cvFileId) {
      alert("No CV available to download.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}/cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "cv.pdf"; // Name of the downloaded file
        link.click();
      } else {
        console.error("Failed to download CV");
        alert("Error downloading CV.");
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("An error occurred while downloading the CV.");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">My CV</h2>

      {/* Upload Section */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Upload New CV</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setNewCvFile(e.target.files[0])}
          className="block w-full mt-2 p-2 border rounded"
        />
        <button
          onClick={handleUploadCv}
          disabled={isUploading}
          className={`mt-2 w-full py-2 px-4 rounded ${
            isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload CV"}
        </button>
      </div>

      {/* Download Section */}
      {cvFileId && (
        <div>
          <button
            onClick={handleDownloadCv}
            className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download CV
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
