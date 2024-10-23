import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCamera, FaEdit, FaSave } from 'react-icons/fa';

const ProfileDetailsPage = () => {
  const { state } = useLocation();
  const { userData } = state || {};

  // Initialize the profile picture and editing state
  const [profilePicture, setProfilePicture] = useState(userData.profilePicture || 'default-profile.png');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  // Handle profile picture change
  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start editing a field
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Save changes to the backend
  const handleSave = async () => {
    console.log('Updated data:', formData);
    setIsEditing(false);
    // Make your API call here to save formData
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Utility function to render data correctly
  const renderField = (key, value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    } else if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value); // Display object as string (for debugging)
    }
    return value || 'N/A'; // Provide a fallback for undefined values
  };

  // Exclude fields that should not be displayed
  const excludedFields = ['id', 'role', 'CreatedAt', 'UpdatedAt', '__v'];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-12">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative flex flex-col items-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4"
          />
          <label className="absolute bottom-2 right-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="hidden"
            />
            <span className="bg-white rounded-full p-2">
              <FaCamera className="text-blue-500 text-xl" />
            </span>
          </label>
          <h2 className="text-2xl font-semibold">{`${formData.firstName} ${formData.lastName}`}</h2>
        </div>
        <div className="p-6 space-y-4">
          {Object.entries(formData).map(([key, value]) => {
            if (excludedFields.includes(key)) return null; // Skip excluded fields
            return (
              <div key={key} className="flex justify-between items-center">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-1"
                  />
                ) : (
                  <p>{renderField(key, value)}</p> // Use renderField to display values correctly
                )}
                {isEditing ? (
                  <button onClick={handleSave} className="text-green-500 ml-4">
                    <FaSave />
                  </button>
                ) : (
                  <button onClick={handleEdit} className="text-blue-500 ml-4">
                    <FaEdit />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsPage;
