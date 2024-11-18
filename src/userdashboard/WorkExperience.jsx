import React, { useState } from 'react';
import { FaBriefcase, FaGraduationCap, FaPlusCircle } from 'react-icons/fa';

const WorkExperience = ({ experiences, setExperiences }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newExperience, setNewExperience] = useState({
    company: '',
    role: '',
    duration: '',
  });

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleAddExperience = async () => {
    if (newExperience.company && newExperience.role && newExperience.duration) {
      try {
        // Send the new experience to the backend API
        const response = await fetch('/api/experiences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newExperience),
        });

        if (response.ok) {
          const addedExperience = await response.json(); // Get the new experience from response
          setExperiences((prev) => [...prev, addedExperience]); // Update state with the new experience
          setNewExperience({ company: '', role: '', duration: '' }); // Reset form fields
          setIsFormVisible(false); // Hide the form
        } else {
          alert('Failed to add experience. Please try again.');
        }
      } catch (error) {
        console.error('Error adding experience:', error);
        alert('Error adding experience');
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex flex-row items-center mb-4">
        <FaGraduationCap className="text-blue-400 mr-2" />
        <h3 className="text-lg">Work experience</h3>
        <FaPlusCircle 
          className="text-blue-500 ml-auto cursor-pointer"
          onClick={() => setIsFormVisible(true)}
        />
      </div>
      <div className='bg-gray-300 h-[2px] w-full mb-4'></div>
      
      {/* Display form if isFormVisible is true */}
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
              onClick={handleAddExperience}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
            <button
              onClick={() => setIsFormVisible(false)} // Close the form without saving
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Display existing experiences */}
      {experiences.map((exp, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-medium">{exp.company}</h3>
          <p className="text-gray-600">{exp.role} - {exp.duration}</p>
        </div>
      ))}
    </div>
  );
};

export default WorkExperience;
