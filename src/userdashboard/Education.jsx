import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaPlusCircle } from 'react-icons/fa';

const Education = ({ applicationId }) => {
  const [education, setEducation] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newEducation, setNewEducation] = useState({
    company: '',
    position: '',
    duration: '',
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const response = await fetch(`https://amsol-api-2.onrender.com/api/applications/${applicationId}`);
        if (response.ok) {
          const data = await response.json();
          setEducation(data.workExperience || []); // Set work experience to state
        } else {
          console.error('Failed to fetch education data');
        }
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };

    fetchEducationData();
  }, [applicationId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleAddEducation = async () => {
    if (newEducation.company && newEducation.position && newEducation.duration) {
      const updatedEducation = [...education, newEducation]; // Add new entry to current state
      try {
        const response = await fetch(`https://amsol-api-2.onrender.com/api/applications/${applicationId}`, {
          method: 'PATCH', // Use PATCH for updating data
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ workExperience: updatedEducation }),
        });

        if (response.ok) {
          setEducation(updatedEducation); // Update state on successful API response
          setNewEducation({ company: '', position: '', duration: '' }); // Reset form
          setIsFormVisible(false); // Hide form
        } else {
          alert('Failed to add education. Please try again.');
        }
      } catch (error) {
        console.error('Error updating education:', error);
        alert('Error updating education');
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-row items-center mb-4">
        <FaBriefcase className="text-blue-400 mr-2" />
        <h3 className="text-lg">Work Experience</h3>
        <FaPlusCircle
          className="text-blue-500 ml-auto cursor-pointer"
          onClick={() => setIsFormVisible(true)}
        />
      </div>

      <div className="bg-gray-300 h-[2px] w-full mb-4"></div>

      {/* Form as a popup */}
      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg mb-4">Add Work Experience</h2>
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={newEducation.company}
              onChange={handleInputChange}
              className="bg-gray-200 p-2 rounded-md w-full mb-2"
            />
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={newEducation.position}
              onChange={handleInputChange}
              className="bg-gray-200 p-2 rounded-md w-full mb-2"
            />
            <input
              type="text"
              name="duration"
              placeholder="Duration (e.g., 3 years)"
              value={newEducation.duration}
              onChange={handleInputChange}
              className="bg-gray-200 p-2 rounded-md w-full mb-2"
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleAddEducation}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setIsFormVisible(false)} // Close form without saving
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display education entries */}
      {education.map((edu, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-medium">{edu.company}</h3>
          <p className="text-gray-600">
            {edu.position} - {edu.duration}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Education;
