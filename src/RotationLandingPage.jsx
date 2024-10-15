import React, { useState } from "react";
import { Link } from "react-router-dom";
import vacancy from "./assets/Vector2tt.svg";
import jobvacancy from "./assets/Group1.svg";
import logo from "./assets/amsolJobVacancies.png";
import { FaHome } from "react-icons/fa";
import arrow from "./assets/vector1.svg";
import jobsKenya from "./assets/Vector-6low.svg";
import desktopbg from "./assets/Desktop.svg";
import topimg from "./assets/Vector-1se.svg";
import secimg from "./assets/Vector-2top.svg";
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
      className={`flex flex-col h-[100vh] lg:overflow-hidden  ${
        isHovered
          ? "bg-gradient-to-r from-[#25b2e6] to-[#0A599E] text-white"
          : "bg-white"
      } transition-colors duration-500`}
    >
      <div className="w-[100%] flex  text-center md:h-[40px] bg-gradient-to-r from-[#25b2e6] to-[#0A599E] md:justify-center  p-2 lg:items-center lg:justify-center">
        <h1 className="text-white font-bold lg:items-center">
          Empowering Organizations To Achieve Emiratization With Our Latest
          Guidebook
        </h1>
      </div>
      <div className="w-[100%] h-[50px] flex justify-around lg:items-center text-blue-400 gap-5 z-10">
  {/* Navbar Section */}
  <div className="w-full flex justify-around items-center p-3 pb-0">
    {/* Logo */}
    <div className="pl-2">
      <img src={logo} alt="hrOutsourcing" className="w-[110px]" />
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
      className={`hidden md:flex flex-row items-center gap-5 ${
        hoveredSection ? "text-white" : "text-[#0A599E]"
      }`}
    >
      <Link to="/" className="hover:text-white flex items-center gap-2">
        <FaHome /> Home
      </Link>
      <Link
        to="/form"
        className={`rounded-full ${
          hoveredSection ? "text-white" : "text-[#0A599E]"
        } hover:text-white p-2 hover:bg-gray-400 font-semibold`}
      >
        About
      </Link>
      <Link
        to="/signupform"
        className={`rounded-full ${
          hoveredSection ? "text-white" : "text-[#0A599E]"
        } hover:text-white p-2 hover:bg-gray-400 font-semibold`}
      >
        Jobs
      </Link>
      <Link
        to="/signupform"
        className={`rounded-full ${
          hoveredSection ? "text-white" : "text-[#0A599E]"
        } hover:text-white p-2 hover:bg-gray-400 font-semibold`}
      >
        Career
      </Link>
    </div>
  </div>

  {/* Mobile Menu */}
  <div
    className={`fixed top-0 left-0 w-full h-full bg-white transition-transform duration-300 ${
      isMenuOpen ? "transform translate-x-0" : "transform -translate-x-full"
    } md:hidden z-50`}
  >
    <div className="p-4 flex justify-between items-start">
      <h2 className="text-lg font-bold">Menu</h2>
      <button onClick={toggleMenu} className="text-2xl focus:outline-none">
        <FaTimes />
      </button>
    </div>
    <div className="p-4 space-y-4">
      <Link to="/" className="flex items-center gap-2 text-[#0A599E]">
        <FaHome /> Home
      </Link>
      <Link
        to="/form"
        className="block text-[#0A599E] hover:bg-gray-200 p-2 rounded"
      >
        About
      </Link>
      <Link
        to="/signupform"
        className="block text-[#0A599E] hover:bg-gray-200 p-2 rounded"
      >
        Jobs
      </Link>
      <Link
        to="/signupform"
        className="block text-[#0A599E] hover:bg-gray-200 p-2 rounded"
      >
        Career
      </Link>
    </div>
  </div>
</div>


      <div className="flex flex-col  w-[100%] h-[180vh] gap-10 md:w-full md:flex-row lg:gap-0">
        <div className="flex w-[80%] h-[60vh] md:w-[60%] md:h-[50vh] lg:w-[60%] relative ">
          <img
            src={topimg}
            className={`h-[4vh] md:h-[7vh] ml-[85%] md:w-[5%] absolute md:ml-[75%] mt-[40px] ${
              isHovered ? "invisible" : "visible"
            }`}
            alt="vacancy"
          />
         <img
  src={vacancy}
  className="w-full h-auto md:w-[100%] md:mt-[19px] object-cover absolute md:-mt-[55px] lg:-mt-[2px] lg:w-[70%]"
  alt="vacancy"
/>


          <h1 className="absolute mt-[44%] w-[100%] ml-[21%] text-4xl  md:ml-[22%] md:mt-[40%]  lg:ml-[20%] lg:mt-[30%] flex flex-col font-extrabold md:text-5xl text-gray-100 ">
            We’re <br />
            AMSOL
            <span className="text-black text-xl w-[100%] font-normal mt-[38%] md:mt-[1%] -ml-[12%] md:-ml-[1%] md:text-1xl w-[100%] md:text-white lg:ml-[0%] lg:mt-[1%]">
              <br />
              The Staffing & HR Solutions
              <br /> specialists
            </span>
          </h1>
        </div>
        {/* Second section */}
        <div className="flex w-[100%] md:w-[45%] md:pr-2 flex-col gap-5  justify-center h-[80vh] lg:w-[40%] lg:gap-0">
          {/* Log in section */}
          <div
            className="flex w-[100%] h-[35vh] gap-5 p-5 flex-col relative parent-container"
            onMouseEnter={() => {
              setHoveredSection("login");
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setHoveredSection(null);
              setIsHovered(false);
            }}
          >
            <h1
              className={` font-extrabold text-3xl z-5  ${
                isHovered ? "text-white" : "text-[#0A599E]"
              }`}
            >
              <img
                src={secimg}
                className={`w-[1%] lg:h-[10vh] lg:w-[18%] absolute ml-[20%] -mt-10 overflow-hidden ${
                  isHovered ? "invisible" : "visible"
                }`}
                alt="vacancy"
              />
              You <br />
              haven't Logged In?
            </h1>
            <p>
              See the latest vacancies and <br />
              how we can supercharge your search
            </p>
            <Link
              to="/form"
              className="flex gap-2 items-center justify-center bg-white rounded-full border border-blue-900 text-[#0A599E] p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-[100px] text-center rotate-hover z-10"
            >
              <span>Log In</span> <img src={arrow} className="w-5 h-5" />
            </Link>
            <div className="animation login-image">
              <img
                src={jobvacancy}
                className={`md:w-[100%] md:h-[50vh] absolute -ml-[250px] z-0 -mt-[250px] hidden-on-hover overflow-hidden ${
                  hoveredSection === "login"
                    ? "animate-rotateIn"
                    : "animate-rotateOut"
                }`}
                alt="jobvacancy"
              />
            </div>
          </div>
          <div className="p-5">
          <div className="flex  items-center justify-center w-[80%] h-[2px] bg-[#0A599E] lg:w-[50%] "></div>
          </div>
          {/* Sign up section */}
          <div
            className="flex h-[30vh] flex-col gap-5 p-5 relative parent-container"
            onMouseEnter={() => {
              setHoveredSection("signup");
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setHoveredSection(null);
              setIsHovered(false);
            }}
          >
            <h1
              className={`font-extrabold text-3xl  ${
                isHovered ? "text-white" : "text-[#0A599E]"
              }`}
            >
              You
              <br /> haven't signed Up?
            </h1>
            <p>
              See the latest vacancies and <br />
              how we can supercharge your search
            </p>
            <Link
              to="/signupform"
              className="flex gap-2 items-center justify-center bg-white rounded-full text-[#0A599E] text-center border border-blue-400  p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-[120px] text-center rotate-hover z-10"
            >
              <span>Sign Up</span> <img src={arrow} className="w-5 h-5" />
            </Link>
            <div className="animation signup-image relative">
              <img
                src={jobvacancy}
                className={`w-[100%] h-[60vh] absolute -ml-[250px] -mt-[300px] z-0 transition-all duration-500 ${
                  hoveredSection === "signup"
                    ? "animate-rotateIn"
                    : "animate-rotateOut"
                }`}
                alt="jobvacancy"
              />
            </div>
            <img
              src={sideimg}
              className={`w-[1%] lg:h-[20vh] lg:w-[20%] absolute ml-[70%] -mt-15 ${
                isHovered ? "invisible" : "visible"
              }`}
              alt="vacancy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotationPandingPage;
