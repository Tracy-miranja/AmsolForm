import React, { useState } from "react";
import { Link } from "react-router-dom";
import vacancy from "./assets/jobsvacancy.svg";
import jobvacancy from "./assets/jobportal.svg";
import logo from "./assets/amsolJobVacancies.png";
import { FaHome } from "react-icons/fa";
import arrow from "./assets/Vector1.svg";
import jobsKenya from "./assets/Vector-6low.svg";
import desktopbg from "./assets/Desktop.svg";
import topimg from "./assets/Group3.png";
import secimg from "./assets/Vector39.png";
import sideimg from "./assets/Vector-2side.svg";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";


const RotationPandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div
      className={`flex flex-col h-screen w-full lg:overflow-hidden  ${isHovered
          ? "bg-gradient-to-r from-[#087EE3] to-blue-500 text-white"
          : "bg-white"
        } transition-colors duration-500 home`}
    >
      <div className="w-[100%] flex shadow-xl text-center md:h-[40px] bg-gradient-to-r from-[#087EE3]  to-[#087EE3] md:justify-center  p-2 lg:items-center lg:justify-center">
        <h2 className="text-white font-bold lg:items-center">
          Empowering Your Next Career Move – Start Your Journey Today
        </h2>
      </div>
        <div className="w-full h-[50px] flex justify-around lg:items-center text-blue-400 gap-5 z-10">
          {/* Navbar Section */}
          <div className="w-full flex justify-around items-center p-3 pb-0">
            {/* Logo */}
            <div className="pl-[10%] lg:mt-4 pb-2">
              <img src={logo} alt="hrOutsourcing" className="w-[110px] " />
            </div>

            {/* Toggle Button for Small Screens */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-2xl focus:outline-none"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Desktop Menu */}
            <div
              className={`hidden md:flex flex-row items-center gap-5 ${hoveredSection ? "text-white" : "text-[#087EE3]"}`}
            >
              <Link to="/" className="hover:text-white flex items-center gap-2">
                <FaHome /> Home
              </Link>
              
              <Link
                to="/Jobs"

                className={`rounded-full ${hoveredSection ? "text-white" : "text-[#087EE3]"} hover:text-white p-2 hover:bg-gray-400 font-semibold`}
              >
                Jobs
              </Link>
              {/* <Link
                to="/dashboard"
                className={`rounded-full ${hoveredSection ? "text-white" : "text-[#087EE3]"} hover:text-blue   p-1 pl-4 pr-4 hover:bg-gray-400 font-semibold`}
              >
                Dashboard
              </Link> */}
              <Link
                to="/cv-update"
                className={`rounded-full ${hoveredSection ? "text-white" : "text-[#087EE3]"} hover:text-blue  border border-blue-900 p-1 pl-4 pr-4 hover:bg-gray-400 font-semibold`}
              >
                cv-update
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 left-0 w-full h-full bg-white transition-transform duration-300 ${isMenuOpen
              ? "transform translate-x-0"
              : "transform -translate-x-full"} md:hidden z-50`}
          >
            <div className="p-4 flex justify-between items-start">
              <h2 className="text-lg font-bold">Menu</h2>
              <button
                onClick={toggleMenu}
                className="text-2xl focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <Link to="/" className="flex items-center gap-2 text-[#087EE3]">
                <FaHome /> Home
              </Link>
              <Link
                to="https://www.amsol.africa/about-amsol"
                className="block text-[#087EE3] hover:bg-gray-200 p-2 rounded"
              >
                About
              </Link>
              <Link
                to="/Jobs"
                className="block text-[#087EE3] hover:bg-gray-200 p-2 rounded"
              >
                Jobs
              </Link>
              <Link
                to="/cv-update"
                className={`rounded-full ${hoveredSection ? "text-white" : "text-[#087EE3]"} hover:text-blue  border border-blue-900 p-1 pl-4 pr-4 hover:bg-gray-400 font-semibold`}
              >
                cv-update
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-screen  w-full  md:flex-row p-0">
  {/* First Section */}
  <div
  className=" flex w-full h-[60vh] md:w-[60%] md:h-screen lg:w-[60%] 
    relative items-center text-center 
    ml-[-2%] md:mt-[-3.5%]"
  style={{
    backgroundImage: `url(${vacancy})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  }}
>

<h1 className="absolute inset-0 flex flex-col items-center justify-center text-4xl font-bold text-gray-100 md:text-3xl lg:text-4xl" style={{
    top: '50%',  
    left: '35%', 
    transform: 'translate(-50%, -50%)', 
  }}>
    We’re AMSOL
    <span className="mt-2 text-sm font-normal text-gray-300 md:mt-3 lg:text-base">
      The Staffing & HR Solutions specialists
    </span>
  </h1>
</div>

  {/* Second Section */}
  <div className="flex flex-col lg:mt-6 gap-6 w-full md:w-[40%] px-5 md:gap-4 lg:px-10">
    {/* Log In Section */}
    <div
      className="flex flex-col gap-4 p-5  shadow-lg rounded-lg relative parent-container hover:bg-blue-500"
      onMouseEnter={() => {
        setHoveredSection("login");
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setHoveredSection(null);
        setIsHovered(false);
      }}
    >
      <h1 className={`text-3xl font-extrabold ${isHovered ? "text-white" : "text-[#087EE3]"}`}>
        You <br /> haven't Logged In?
      </h1>
      <p className={`${isHovered ? "text-white" : "text-[#087EE3]"}`}>
        See the latest vacancies and <br /> how we can supercharge your search.
      </p>
      <Link
        to="/auth"
        className="flex items-center justify-center gap-2 bg-white border border-[#087EE3] rounded-full text-[#087EE3] px-4 py-2 hover:bg-blue-400 hover:text-white font-bold"
      >
        Log In <img src={arrow} className="w-5 h-5" alt="arrow" />
      </Link>
      {/* <div className="animation login-image">
        <img
          src={jobvacancy}
          className={`absolute w-full h-full transition-all duration-500 ${hoveredSection === "login" ? "animate-rotateIn" : "animate-rotateOut"}`}
          alt="jobvacancy"
        />
      </div> */}
    </div>

    {/* Divider */}
    {/* <div className="flex items-center justify-center w-full h-[2px] bg-blue-800"></div> */}

    {/* Sign Up Section */}
    <div
    className="flex flex-col gap-4 p-5 shadow-lg rounded-lg relative parent-container hover:bg-blue-500"
    onMouseEnter={() => {
      setHoveredSection("signup");
      setIsHovered(true);
      document.body.classList.add("bg-blue-500"); 
    }}
    onMouseLeave={() => {
      setHoveredSection(null);
      setIsHovered(false);
      document.body.classList.remove("bg-blue-500"); 
    }}
  >
    <h1 className={`text-3xl font-extrabold ${isHovered ? "text-white" : "text-[#087EE3]"}`}>
      You <br /> haven't Signed Up?
    </h1>
    <p className={`${isHovered ? "text-white" : "text-[#087EE3]"}`}>
      Sign up now to secure your <br /> interview opportunity and boost your career!
    </p>
    <Link
      to="/register"
      className="flex items-center justify-center gap-2 bg-white border border-[#087EE3] rounded-full text-[#087EE3] px-4 py-2 hover:bg-blue-400 hover:text-white font-bold"
    >
      Sign Up <img src={arrow} className="w-5 h-5" alt="arrow" />
    </Link>
    {/* <div className="animation signup-image">
      <img
        src={jobvacancy}
        className={`absolute w-full h-full transition-all duration-500 ${hoveredSection === "signup" ? "animate-rotateIn" : "animate-rotateOut"}`}
        alt="jobvacancy"
      />
    </div> */}
  </div>
  </div>
</div>
    </div>
  );
};

export default RotationPandingPage;
