import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../Context/UserContext"
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaUser, FaBriefcase, FaClipboardList, FaFileAlt} from "react-icons/fa";
import { FaUserAlt, FaCamera, FaPhoneAlt, FaLinkedin, FaMapMarkerAlt, FaLink, FaEdit, FaSave } from 'react-icons/fa';

const Sidebar = ({ user = {}, onUpdateProfilePicture, onUpdateProfileInfo }) => {
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '123-456-7890');
  const [linkedin, setLinkedin] = useState(user.linkedin || 'https://linkedin.com/in/johndoe');
  const [location, setLocation] = useState(user.location || 'New York, USA');
  const [website, setWebsite] = useState(user.website || 'https://johndoe.com');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData]=useState({})
  
  const { userId, token } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://amsol-api-2.onrender.com/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        toast.error
      }
    };
    fetchData();
  }, [userId, token]);
  
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file); 
      try {
        const response = await axios.put(
          `https://amsol-api-2.onrender.com/api/profile/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Update the profile picture state with the returned fileId
        const fileId = response.data.fileId;
        setProfilePicture(`/api/profile/picture/${fileId}`);
        toast.success('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        toast.error('Failed to upload profile picture.');
      }
    }
  };
  
  const handleSave = async () => {
    setIsEditing(false);
    try {
      const updatedData = {
        phoneNumber,
        linkedin,
        location,
        website,
        profilePicture, 
      };
  
      const response = await axios.put(
        `https://amsol-api-2.onrender.com/api/profile/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success('Profile updated successfully!');
      if (onUpdateProfileInfo) onUpdateProfileInfo(response.data.user);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-[#25b2e6] to-blue-500 text-white min-h-screen shadow rounded-lg p-6 mb-6 relative">
      <div className="flex flex-col items-center space-x-6 relative">
        <div className="relative">
          {profilePicture ? (
            <img
              className="w-24 h-24 rounded-full border-2 border-gray-300"
              src={profilePicture}
              alt="Profile"
              onError={(e) => { e.target.src = '/default-profile.png'; }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
              <FaUserAlt className="text-gray-500 text-4xl" />
            </div>
          )}

          <label htmlFor="upload-input" className="absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full cursor-pointer">
            <FaCamera className="text-white text-lg" />
          </label>
          <input
            id="upload-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">{userData.username || 'Unknown User'}</h2>
          <p className="text-white-600">{userData.email || 'Unknown email'}</p>
        </div>
      </div>

      {/* Edit Icon */}
      {/* <div className="flex justify-end mt-4">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-white hover:text-gray-300">
            <FaEdit className="text-xl" />
          </button>
        ) : (
          <button onClick={handleSave} className="text-white hover:text-gray-300">
            <FaSave className="text-xl" />
          </button>
        )}
      </div> */}
      
      <div className="flex flex-col justify-center pl-6  gap-4 mt-5">
      
      <Link to="/dashboard" className="flex items-center space-x-4">
        <FaUser className="text-black text-2xl" />
        <span className="mt-2 text-white font-bold">Profile</span>
      </Link>
      
     
      <Link to="/applications" className="flex items-center space-x-4">
        <FaBriefcase className="text-black text-2xl" />
        <span className="mt-2 text-white text-sm font-bold">Application</span>
      </Link>

      <Link to="/Profilepage" className="flex items-center space-x-4">
        <FaFileAlt className="text-black text-2xl" />
        <span className="mt-2 text-white text-sm font-bold">Career</span>
      </Link>
    </div>
    </div>
  );
};

export default Sidebar;
