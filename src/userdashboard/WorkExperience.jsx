import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaPlusCircle, FaEdit } from 'react-icons/fa';

const WorkExperience = ({ userId, setExperiences }) => {
  const [experiences, setExperiencesState] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newExperience, setNewExperience] = useState({
    company: '',
    role: '',
    duration: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch experiences from the API for the specific user when the component mounts
  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://amsol-api-production.up.railway.app/api/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.work_experience) {
            setExperiencesState(data.work_experience); // Assuming the API returns an object with a 'work_experience' field
            setExperiences(data.work_experience); // Optionally update the parent state
          }
        } else {
          console.error('Failed to fetch experiences:', response.statusText);
          setError('Failed to load experiences.');
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setError('An error occurred while fetching experiences.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchExperiences();
    }
  }, [userId, setExperiences]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for adding or updating experience
  const handleAddOrUpdateExperience = async () => {
    if (newExperience.company && newExperience.role && newExperience.duration) {
      setLoading(true);
      try {
        if (editingIndex !== null) {
          // Update existing experience
          const response = await fetch(`https://amsol-api-production.up.railway.app/api/profile/${userId}/experiences/${experiences[editingIndex]._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newExperience),
          });

          if (response.ok) {
            const updatedExperience = await response.json();
            const updatedExperiences = [...experiences];
            updatedExperiences[editingIndex] = updatedExperience;
            setExperiencesState(updatedExperiences);
            setExperiences(updatedExperiences);
            setEditingIndex(null);
          } else {
            setError('Failed to update experience. Please try again.');
          }
        } else {
          // Add new experience
          const response = await fetch(`https://amsol-api-production.up.railway.app/api/users/${userId}/profile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newExperience),
          });

          if (response.ok) {
            const addedExperience = await response.json();
            setExperiencesState((prev) => [...prev, addedExperience]);
            setExperiences((prev) => [...prev, addedExperience]);
          } else {
            setError('Failed to add experience. Please try again.');
          }
        }

        setNewExperience({ company: '', role: '', duration: '' });
        setIsFormVisible(false);
      } catch (error) {
        console.error('Error handling experience:', error);
        setError('An error occurred while processing your request.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('All fields are required.');
    }
  };

  // Edit experience handler
  const handleEditExperience = (index) => {
    setNewExperience(experiences[index]);
    setEditingIndex(index);
    setIsFormVisible(true);
    setError(''); // Clear any existing errors
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex flex-row items-center mb-4">
        <FaGraduationCap className="text-blue-400 mr-2" />
        <h3 className="text-lg">Work Experience</h3>
        <FaPlusCircle
          className="text-blue-500 ml-auto cursor-pointer"
          onClick={() => {
            setNewExperience({ company: '', role: '', duration: '' });
            setIsFormVisible(true);
            setEditingIndex(null);
            setError(''); // Clear any existing errors
          }}
        />
      </div>
      <div className="bg-gray-300 h-[2px] w-full mb-4"></div>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {isFormVisible && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={newExperience.company}
            onChange={handleInputChange}
            className="bg-gray-200 p-2 rounded-md w-full mb-2"
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={newExperience.role}
            onChange={handleInputChange}
            className="bg-gray-200 p-2 rounded-md w-full mb-2"
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., Jan 2020 - Dec 2021)"
            value={newExperience.duration}
            onChange={handleInputChange}
            className="bg-gray-200 p-2 rounded-md w-full mb-2"
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleAddOrUpdateExperience}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {editingIndex !== null ? 'Update' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsFormVisible(false);
                setError('');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {experiences.map((exp, index) => (
        <div key={exp._id || index} className="mb-4">
          <h3 className="text-lg font-medium">{exp.company}</h3>
          <p className="text-gray-600">{exp.role} - {exp.duration}</p>
          <FaEdit
            className="text-blue-500 cursor-pointer"
            onClick={() => handleEditExperience(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default WorkExperience;
