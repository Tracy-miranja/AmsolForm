import React, { useState } from 'react';

const Profile = ({ userCV }) => {
  const [cvFile, setCvFile] = useState(userCV || null);

  // Handle file upload
  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You can add logic here to upload the file to the backend server
      console.log('CV file selected:', file);
      setCvFile(file);
    }
  };

  // Function to trigger the download
  const handleDownloadCv = () => {
    if (cvFile && typeof cvFile === 'string') {
      const link = document.createElement('a');
      link.href = cvFile; 
      link.download = 'cv.pdf'; 
      link.click();
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#25b2e6] to-blue-500 text-white w-64 h-auto p-2">
      <h2 className="text-2xl font-bold mb-4">Update CV</h2>
      
      {/* File input for uploading a CV */}
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleCvUpload}
          className="text-gray-800 bg-white rounded w-[100%] "
        />
      </div>

      {/* Conditional rendering for download section */}
      {cvFile ? (
        <div className="mt-4">
          <h3 className="mb-2">Download CV</h3>
          <button
            onClick={handleDownloadCv}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Download CV
          </button>
        </div>
      ) : (
        <div className="mt-4 text-gray-400">No CV available for download</div>
      )}
    </div>
  );
};

export default Profile;
