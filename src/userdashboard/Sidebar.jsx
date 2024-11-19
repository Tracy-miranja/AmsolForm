import React, { useState } from 'react';
import { FaUserAlt, FaCamera, FaPhoneAlt, FaLinkedin, FaMapMarkerAlt, FaLink, FaEdit, FaSave } from 'react-icons/fa';

const Sidebar = ({ user = {}, onUpdateProfilePicture, onUpdateProfileInfo }) => {
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '123-456-7890');
  const [linkedin, setLinkedin] = useState(user.linkedin || 'https://linkedin.com/in/johndoe');
  const [location, setLocation] = useState(user.location || 'New York, USA');
  const [website, setWebsite] = useState(user.website || 'https://johndoe.com');
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        if (onUpdateProfilePicture) onUpdateProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Send updated data to the backend here
    if (onUpdateProfileInfo) {
      onUpdateProfileInfo({ phoneNumber, linkedin, location, website });
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
          <h2 className="text-2xl font-semibold">{user.name || 'Unknown User'}</h2>
          <p className="text-white-600">{user.email || 'Unknown email'}</p>
        </div>
      </div>

      {/* Edit Icon */}
      <div className="flex justify-end mt-4">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-white hover:text-gray-300">
            <FaEdit className="text-xl" />
          </button>
        ) : (
          <button onClick={handleSave} className="text-white hover:text-gray-300">
            <FaSave className="text-xl" />
          </button>
        )}
      </div>

      <div className="mt-4">
        <ul className="flex flex-col space-y-4">
          {/* Phone Number Section */}
          <li className="flex items-center space-x-2">
            <FaPhoneAlt className="text-blue-500" />
            {isEditing ? (
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-gray-700 p-2 rounded-md text-white w-full"
              />
            ) : (
              <p className="bg-gradient-to-r from-[#25b2e6] to-blue-500 p-2 rounded-md text-white w-full">{phoneNumber}</p>
            )}
          </li>

          {/* LinkedIn Section */}
          <li className="flex items-center space-x-2">
            <FaLinkedin className="text-blue-500" />
            {isEditing ? (
              <input
                type="text"
                placeholder="LinkedIn Profile"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="bg-gray-700 p-2 rounded-md text-white w-full"
              />
            ) : (
              <p className="bg-gradient-to-r from-[#25b2e6] to-blue-500 p-2 rounded-md text-white w-full">{linkedin}</p>
            )}
          </li>

          {/* Location Section */}
          <li className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-green-500" />
            {isEditing ? (
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-gray-700 p-2 rounded-md text-white w-full"
              />
            ) : (
              <p className="bg-gradient-to-r from-[#25b2e6] to-blue-500 p-2 rounded-md text-white w-full">{location}</p>
            )}
          </li>

          {/* Website Section */}
          <li className="flex items-center space-x-2">
            <FaLink className="text-red-500" />
            {isEditing ? (
              <input
                type="text"
                placeholder="Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="bg-gray-700 p-2 rounded-md text-white w-full"
              />
            ) : (
              <p className="bg-gradient-to-r from-[#25b2e6] to-blue-500 p-2 rounded-md text-white w-full">{website}</p>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
