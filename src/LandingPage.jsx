import React, { useState } from "react";
import chair from "./assets/hiring.png";
import Navbar from "./navbar";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal state

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Navbar />
      <div className="h-[100vh] bg-gradient-to-r from-[#25b2e6] to-[#0922e3] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Welcome Section */}
        <div className="text-center flex flex-col items-center justify-center space-y-4 z-10">
          <h1 className="text-5xl font-bold text-white mb-6">Welcome to AMSOL career page</h1>
          <p className="text-lg text-gray-100 max-w-md mb-6">
            Sign Up and Apply for your dream job today! Discover opportunities, submit your application, and take the next step in your career journey.
          </p>
          <Link to="/form" className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-white hover:text-blue-800 transition shadow-lg">
            Get Started
          </Link>
        </div>

        {/* Decorative White Circle and Image */}
        <div className="flex justify-center items-center space-x-8 z-10">
          <div>
            <img src={chair} alt="Decorative chair" className="h-[350px] object-cover -ml-10" />
          </div>
        </div>

        {/* Mountain-like Shape */}
        <div className="absolute inset-x-0 bottom-0">
          <svg viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#fff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,213.3C672,235,768,277,864,282.7C960,288,1056,256,1152,229.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L0,320Z"></path>
          </svg>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h2 className="text-2xl font-bold mb-4">View Available Jobs</h2>
              <p className="mb-6">Click get started button and Check out our latest job openings and apply for your dream job today!</p>
              <div className="flex justify-around">
                <Link to="/jobs" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
                  View Jobs
                </Link>
                <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded-full hover:bg-gray-400 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
