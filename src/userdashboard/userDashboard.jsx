import React from "react";
import { FaUserAlt, FaBriefcase, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import Sidebar from './Sidebar';
import { Link } from "react-router-dom";
import HandleLogout from "../logout";

const UserDashbaord = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className='flex gap-5 bg-blue-500 p-3'>
      <div className='w-[80%]'></div>
      <Link to="/" className='mt-1 text-white'>Home</Link>
            <HandleLogout />
          </div>
          <div className="flex ">
      <div>
      <Sidebar />
      </div>
      <div className=" flex  w-[40%] mx-auto bg-white mt-14 rounded-lg shadow-xl h-[20%] flex-col justify-center ">
        <div className="px-6 py-8 space-y-4">
          <div className="flex items-center space-x-4">
            <FaUserAlt className="text-indigo-500" />
            <p className="text-gray-700"><span className="font-bold">Username:</span> johndoe</p>
          </div>

          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-indigo-500" />
            <p className="text-gray-700"><span className="font-bold">Email:</span> johndoe@example.com</p>
          </div>

          <div className="flex items-center space-x-4">
            <FaPhoneAlt className="text-indigo-500" />
            <p className="text-gray-700"><span className="font-bold">Phone:</span> +123 456 7890</p>
          </div>

          <div className="flex items-center space-x-4">
            <FaBriefcase className="text-indigo-500" />
            <p className="text-gray-700"><span className="font-bold">Job Title:</span> Frontend Developer</p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="px-6 pb-8">
        <button className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserDashbaord;
