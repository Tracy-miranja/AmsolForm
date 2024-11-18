import React, { useState } from 'react';
import { FaBriefcase, FaGraduationCap, FaPlusCircle } from 'react-icons/fa';

const Education = ({ education, setEducation }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    year: '',
  });

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
    if (newEducation.institution && newEducation.degree && newEducation.year) {
      try {
        const response = await fetch('/api/education', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEducation),
        });

        if (response.ok) {
          const addedEducation = await response.json();
          setEducation((prev) => [...prev, addedEducation]); // Update state with new entry
          setNewEducation({ institution: '', degree: '', year: '' }); // Reset form fields
          setIsFormVisible(false); // Hide form after submission
        } else {
          alert('Failed to add education. Please try again.');
        }
      } catch (error) {
        console.error('Error adding education:', error);
        alert('Error adding education');
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-row items-center mb-4">
        <FaBriefcase className="text-blue-400 mr-2" />
        <h3 className="text-lg">Education</h3>
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
            <h2 className="text-lg mb-4">Add New Education</h2>
            <input
              type="text"
              name="institution"
              placeholder="Institution Name"
              value={newEducation.institution}
              onChange={handleInputChange}
              className="bg-gray-200 p-2 rounded-md w-full mb-2"
            />
            <input
              type="text"
              name="degree"
              placeholder="Degree"
              value={newEducation.degree}
              onChange={handleInputChange}
              className="bg-gray-200 p-2 rounded-md w-full mb-2"
            />
            <input
              type="text"
              name="year"
              placeholder="Year (e.g., 2021)"
              value={newEducation.year}
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
          <h3 className="text-lg font-medium">{edu.institution}</h3>
          <p className="text-gray-600">{edu.degree} - {edu.year}</p>
        </div>
      ))}
    </div>
  );
};

export default Education;
