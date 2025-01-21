import React, { useState, useEffect } from 'react';
import { FaPlusCircle } from 'react-icons/fa';

const Certificates = ({ certificates = [], setCertificates }) => {
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    organization: '',
    date: '',
    file: null,
  });

  const [isFormVisible, setIsFormVisible] = useState(false); // Track form visibility

  // Handle form field changes
  const handleCertificateChange = (event) => {
    const { name, value } = event.target;
    setNewCertificate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const { files } = event.target;
    setNewCertificate((prev) => ({
      ...prev,
      file: files[0], // Save the file
    }));
  };

  // Save the new certificate to the backend and update the list of certificates
  const handleAddCertificate = async () => {
    if (newCertificate.name && newCertificate.organization && newCertificate.date) {
      // Prepare form data to send to backend (including file if present)
      const formData = new FormData();
      formData.append('name', newCertificate.name);
      formData.append('organization', newCertificate.organization);
      formData.append('date', newCertificate.date);
      if (newCertificate.file) {
        formData.append('file', newCertificate.file);
      }

      try {
        // Send the certificate data to the backend API
        const response = await fetch('/api/certificates', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const addedCertificate = await response.json(); 
          setCertificates((prev) => [...prev, addedCertificate]); 
          setNewCertificate({ name: '', organization: '', date: '', file: null }); 
          setIsFormVisible(false); 
        } else {
          alert('Failed to save the certificate. Please try again.');
        }
      } catch (error) {
        console.error('Error saving certificate:', error);
        alert('Error saving certificate');
      }
    }
  };

  // Fetch certificates from the backend when the component mounts
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/certificates');
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, [setCertificates]);

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-5">
      <div className="flex items-center justify-between space-x-2">
        
        <div><span className="text-lg">Certificates</span></div>
        <div><FaPlusCircle className="text-blue-500 cursor-pointer" onClick={() => setIsFormVisible(true)} /></div>
      </div>
      <div className='bg-gray-300 h-[2px] w-full'></div>
      {/* Show Form when isFormVisible is true */}
      {isFormVisible && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <input
            type="text"
            name="name"
            placeholder="Certificate Name"
            value={newCertificate.name}
            onChange={handleCertificateChange}
            className="bg-gray-700 p-2 rounded-md text-white w-full mb-2"
          />
          <input
            type="text"
            name="organization"
            placeholder="Issuing Organization"
            value={newCertificate.organization}
            onChange={handleCertificateChange}
            className="bg-gray-700 p-2 rounded-md text-white w-full mb-2"
          />
          <input
            type="text"
            name="date"
            placeholder="Date Obtained"
            value={newCertificate.date}
            onChange={handleCertificateChange}
            className="bg-gray-700 p-2 rounded-md text-white w-full mb-2"
          />
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="bg-gray-700 p-2 rounded-md text-white w-full mb-2"
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleAddCertificate}
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

      {/* Display Added Certificates */}
      <div className="space-y-2 mt-4">
        {certificates && certificates.length > 0 ? (
          certificates.map((cert, index) => (
            <div key={index} className="p-2 bg-gray-700 rounded-md">
              <h4 className="font-semibold text-white">{cert.name}</h4>
              <p className="text-gray-300">{cert.organization}</p>
              <p className="text-gray-400">{cert.date}</p>
              {cert.file && (
                <a href={cert.fileUrl} target="_blank" className="text-blue-300 mt-2 block">
                  View Certificate
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No certificates added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Certificates;
