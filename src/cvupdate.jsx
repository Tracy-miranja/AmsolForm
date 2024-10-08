import React, { useState } from 'react';
import axios from 'axios';
import logo from "./assets/amsolJobVacancies.png";
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const UpdateCV = ({ userId }) => {
  const [cvFile, setCvFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!cvFile) {
      setMessage('Please select a CV to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('cv', cvFile); // Append the CV file to the form data

    try {
      const response = await axios.put(`/Api/users/${userId}/cv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message); 
    } catch (error) {
      console.error('Error updating CV:', error);
      setMessage('Failed to update CV. Please try again.');
    }
  };

  return (
    <div className='w-[100%] h-[100vh]'>
    <div className=" w-[100%] h-[50px] bg-gradient-to-r from-[#25b2e6] to-blue-500 flex items-center justify-around shadow-2xl p-8 text-white gap-5">
        <div className="bg-white rounded-full w-[200px] flex items-center justify-center"> 
          <img src={logo} alt="hrOutsourcing" className="w-[110px] p-1" />
        </div>
        <div className="flex flex-row items-center gap-5">
          <Link className="text-white flex flex-row gap-2" to="/"><FaHome className="mt-1"/>Home</Link>
        </div>
      </div>
      <div className='flex justify-center items-center justify-center'>
        
        </div>
    <div className="cv-update-form w-[100%] flex flex-col justify-center items-center h-[70vh]">    
    <h2 className='font-bold'>Update Your CV</h2>
        <div className='p-6 w-[40%] p-10'>
      <form onSubmit={handleUpdate} className='flex flex-col gap-3 items-center shadow-lg p-10'>
        <div>
        <label htmlFor="cvFile"></label>
        <input
          type="file"
          id="cvFile"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
        </div>
        <button type="submit" className="flex gap-2 items-center justify-center bg-white rounded-full border border-blue-900 text-[#0A599E] p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-fit text-center rotate-hover z-10">Update CV</button>
      </form>
     
      </div>
      <div className='text-red-500 mt-5'>
      {message && <p>{message}</p>}
      </div>
    </div>
    </div>
  );
};

export default UpdateCV;
