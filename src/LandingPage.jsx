import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import job from "./assets/job.png";
import banner from "./assets/banner.json";
import Lottie from "lottie-react";
import RotationPandingPage from "./RotationLandingPage";

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [count, setCount] = useState(7000);
  const [endCount, setEndCount] = useState(9000);
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, delay) => {
    setTimeout(() => {
      const id = Date.now(); // Unique id for each notification
      setNotifications((prev) => [...prev, { id, message }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 2000);
    }, delay);
  };

  useEffect(() => {
    const messages = [
      "New Job Opportunity!",
      "Director of Finance!",
      "Strategic Partnerships Lead",
    ];

    messages.forEach((message, index) => {
      showNotification(message, 2000 * index);
    });
  }, []);

  const resetCount = () => {
    setCount(7000);
    setTimeout(() => {
      setCount(8000);
    }, 100);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      resetCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <RotationPandingPage />
      <div className="white-fill">hello</div>
      <Navbar />
      <div className="h-[90vh] bg-gradient-to-r from-[#25b2e6] to-blue-500 flex flex-row items-center justify-center overflow-hidden w-full p-20 hover:bg-black">
        {/* Welcome Section */}
        <div className="flex flex-col justify-center items-center z-10 w-[50%] h-auto -mt-40 gap-3">
          <div>
            <h1 className="text-5xl font-bold text-white mb-6 text-center">
              <span>Welcome</span> to AMSOL
              <br />
              career page
            </h1>
            <p className="text-sm text-gray-100 max-w-md mb-6 text-center">
              Sign Up and apply for your dream job today! Discover
              opportunities, submit your application, and take the next step in
              your career journey.
            </p>
          </div>
          <div className="flex gap-5 w-[100%] items-center justify-center">
            <Link
              to="/form"
              className="bg-transparent w-[20%] border text-center border-white rounded-full text-white p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold"
            >
              Log In
            </Link>
            <Link
              to="/signupform"
              className="bg-inherit border w-[20%] text-center border-white rounded-full text-white p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold"
            >
              Sign Up
            </Link>
          </div>
          <div className="flex gap-5 mt-5 ">
            <div className="flex flex-col text-white font-bold items-center text-medium">
              <span>
                <CountUp
                  start={count}
                  end={endCount}
                  duration={10}
                  onComplete={resetCount}
                />
                <span className="text-[#FF8000]">+</span>
              </span>
              <span> jobs available</span>
            </div>
            <div className="flex flex-col text-white font-bold items-center">
              <span>
                <CountUp
                  start={200}
                  end={900}
                  duration={4}
                  onComplete={resetCount}
                />
                <span className="text-[#FF8000]">+</span>
              </span>
              <span> Career</span>
            </div>
            <div className="flex flex-col text-white font-bold items-center">
              <span>
                <CountUp
                  start={2000}
                  end={5000}
                  duration={4}
                  onComplete={resetCount}
                />
                <span className="text-[#FF8000]">+</span>
              </span>
              <span> Success story</span>
            </div>
          </div>
        </div>

        {/* Decorative White Circle and Image */}
        <div className="relative flex justify-center items-center w-[50%] h-auto rounded-r-full pb-20">
          {/* <img src={job} alt="banner image" className="-mt-12 -mt-40" /> */}
          <Lottie animationData={banner} className="h-[70vh]" loop autoplay />
          {/* Render Notifications */}
          <div className="absolute right-0 top-10 flex flex-col space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-blue-500 text-white p-2 rounded shadow-lg transition-transform duration-300 transform translate-x-0"
                style={{ animation: "slideIn 0.3s forwards" }}
              >
                {notification.message}
              </div>
            ))}
          </div>
        </div>
        {/* Mountain-like Shape */}
        <div className="absolute inset-x-0 bottom-0">
          <svg viewBox="0 0 1440 320" className="w-full h-full">
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,213.3C672,235,768,277,864,282.7C960,288,1056,256,1152,229.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h2 className="text-2xl font-bold mb-4">View Available Jobs</h2>
              <p className="mb-6">
                Click get started button and Check out our latest job openings
                and apply for your dream job today!
              </p>
              <div className="flex justify-around">
                <Link
                  to="/jobs"
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                >
                  View Jobs
                </Link>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded-full hover:bg-gray-400 transition"
                >
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
