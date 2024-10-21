import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    bio: "",
    address: "",
    profilePicture: "",
    resume: "",
  });
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [message, setMessage] = useState("");

  // Ensure all fields are populated with defaults when fetching profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.post("http://localhost:5000/profile");
        setProfile({
          bio: data.profile?.bio || "",
          address: data.profile?.address || "",
          profilePicture: data.profile?.profilePicture || "",
          resume: data.profile?.resume || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profilePicture") setSelectedProfilePicture(files[0]);
    if (name === "resume") setSelectedResume(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", selectedProfilePicture);
    formData.append("resume", selectedResume);
    formData.append("bio", profile.bio);
    formData.append("address", profile.address);

    try {
      await axios.post("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Profile update failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="w-full max-w-lg p-8 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Edit Profile</h2>
        {message && <p className="text-center text-green-500">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            placeholder="Short bio"
            rows="3"
            className="w-full p-2 border rounded"
          ></textarea>

          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full p-2 border rounded"
          />

          <div>
            <label className="block mb-1">Profile Picture:</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">CV/Resume:</label>
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
